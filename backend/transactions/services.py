from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal

from customers.models import (
    Customer,
    PointsHistory
)

from fuel.models import FuelRate
from .models import Transaction

from django.utils import timezone
from datetime import timedelta


# -----------------------------------
# CONFIG
# -----------------------------------

POINT_RATE = Decimal("0.1")
# ₹1 spent = 0.1 points

POINT_REDEEM_VALUE = Decimal("0.1")
# 1 point = ₹0.1 discount


# -----------------------------------
# PROCESS TRANSACTION
# -----------------------------------
@transaction.atomic
def process_transaction(
    data,
    attendant
):

    mobile = data["mobile_number"]

    if not mobile:
        raise ValueError("Mobile number required")

    pump = attendant.pump

    if not pump:
        raise ValueError(
            "Attendant is not assigned to any pump"
        )

    if not pump.is_active:
        raise ValueError("Pump is inactive")

    fuel_type = data["fuel_type"]

    original_amount = Decimal(str(data["amount"]))

    amount = original_amount

    if amount < 0:
        raise ValueError(
            "Transaction amount cannot be negative"
        )

    redeem_points = Decimal(
        data.get(
            "redeem_points",
            0
        )
    )

    if redeem_points not in [0, Decimal("1000")]:
        raise ValueError("Invalid redeem points")

    manager = pump.manager

    # -----------------------------------
    # GET / CREATE CUSTOMER
    # -----------------------------------
    customer, _ = (
        Customer.objects
        .select_for_update()
        .get_or_create(
            mobile_number=mobile,
            defaults={
                "name": data.get(
                    "name",
                    "Customer"
                )
            }
        )
    )

    # -----------------------------------
    # GET FUEL RATE
    # -----------------------------------
    fuel_rate = get_object_or_404(
        FuelRate,
        pump=pump,
        fuel_type=fuel_type
    )

    price = fuel_rate.price_per_litre

    if price <= 0:
        raise ValueError("Invalid fuel rate")

    # -----------------------------------
    # CALCULATE QUANTITY
    # -----------------------------------
    quantity = (original_amount / price).quantize(Decimal("0.001"))

    # -----------------------------------
    # WEEKLY REDEEM CHECK
    # -----------------------------------
    if redeem_points == Decimal("1000"):
        last_redeem = PointsHistory.objects.filter(
            customer=customer,
            type="redeem",
            reversal__isnull=True
        ).order_by("-created_at").first()

        if last_redeem:
            next_allowed = last_redeem.created_at + timedelta(days=7)

            if timezone.now() < next_allowed:
                raise ValueError(
                    f"Customer can redeem again after {next_allowed}"
                )
    
    # -----------------------------------
    # REDEEM LOGIC
    # -----------------------------------
    points_used = Decimal("0")

    if redeem_points == Decimal("1000"):

        if original_amount < Decimal("100"):
            raise ValueError("Minimum ₹100 required to redeem")

        if customer.total_points < redeem_points:
            raise ValueError("Insufficient points")

        points_used = redeem_points

        redeem_value = (
            redeem_points * POINT_REDEEM_VALUE
        ).quantize(Decimal("0.01"))

        amount = (amount - redeem_value).quantize(Decimal("0.01"))

    # -----------------------------------
    # EARN LOGIC
    # -----------------------------------
    points_earned = (
        amount *
        POINT_RATE
    ).quantize(Decimal("0.01"))

    # -----------------------------------
    # UPDATE CUSTOMER BALANCE
    # -----------------------------------
    remaining_points = (
        customer.total_points
        - points_used
        + points_earned
    ).quantize(Decimal("0.01"))

    if remaining_points < 0:
        remaining_points = Decimal("0.00")

    customer.total_points = (
        remaining_points
    )

    customer.save()

    # -----------------------------------
    # SNAPSHOT VALUES
    # -----------------------------------
    attendant_name = (
        attendant.user.get_full_name().strip()
        or attendant.user.username
    )

    manager_name = None
    manager_phone = None

    if manager and manager.user:
        manager_name = (
            manager.user.get_full_name().strip()
            or manager.user.username
        )

        manager_phone = (
            manager.user.username
        )

    # -----------------------------------
    # CREATE TRANSACTION
    # -----------------------------------
    transaction = Transaction.objects.create(
        # Live Relations
        customer=customer,
        pump=pump,
        attendant=attendant,
        manager=manager,

        # Fuel
        fuel_type=fuel_type,

        # Amounts
        original_amount=original_amount,
        final_amount=amount,
        quantity=quantity,

        # Points
        points_used=points_used,
        points_earned=points_earned,
        remaining_points=remaining_points,

        # Customer Snapshot
        customer_name=customer.name,
        customer_mobile=customer.mobile_number,

        # Pump Snapshot
        pump_code=pump.pump_code,
        pump_name=pump.pump_name,
        pump_location=pump.location,

        # Attendant Snapshot
        attendant_name=attendant_name,
        attendant_phone=attendant.user.username,

        # Manager Snapshot
        manager_name=manager_name,
        manager_phone=manager_phone,
    )

    # -----------------------------------
    # POINTS HISTORY (EARN)
    # -----------------------------------
    if points_earned > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,

            customer_name=customer.name,
            customer_mobile=customer.mobile_number,

            points_change=points_earned,
            balance_after=remaining_points,
            type="earn",
        )

    # -----------------------------------
    # POINTS HISTORY (REDEEM)
    # -----------------------------------
    if points_used > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,

            customer_name=customer.name,
            customer_mobile=customer.mobile_number,

            points_change=-points_used,
            balance_after=remaining_points,
            type="redeem",
        )

    return transaction


# -----------------------------------
# REVERSE TRANSACTION
# -----------------------------------
@transaction.atomic
def reverse_transaction(original_txn):

    # Cannot reverse a reversal
    if original_txn.transaction_type == "reversal":
        raise ValueError("Cannot reverse a reversal transaction")

    # Already reversed (check via relation)
    if hasattr(original_txn, "reversal_entry"):
        raise ValueError("Transaction already reversed")

    customer = original_txn.customer

    # -----------------------------------
    # FIX CUSTOMER POINTS
    # -----------------------------------
    points_to_restore = (
        original_txn.points_used - original_txn.points_earned
    ).quantize(Decimal("0.01"))

    if customer:
        customer.total_points = (
            customer.total_points + points_to_restore
        ).quantize(Decimal("0.01"))

        if customer.total_points < 0:
            customer.total_points = Decimal("0.00")

        customer.save()

    # -----------------------------------
    # CREATE REVERSAL TRANSACTION
    # -----------------------------------
    reversed_txn = Transaction.objects.create(
        customer=original_txn.customer,
        pump=original_txn.pump,
        attendant=original_txn.attendant,
        manager=original_txn.manager,

        transaction_type="reversal",
        original_transaction=original_txn,

        fuel_type=original_txn.fuel_type,

        original_amount=-original_txn.original_amount,
        final_amount=-original_txn.final_amount,
        quantity=-original_txn.quantity,

        points_used=-original_txn.points_used,
        points_earned=-original_txn.points_earned,
        remaining_points=customer.total_points if customer else Decimal("0.00"),

        customer_name=original_txn.customer_name,
        customer_mobile=original_txn.customer_mobile,

        pump_code=original_txn.pump_code,
        pump_name=original_txn.pump_name,
        pump_location=original_txn.pump_location,

        attendant_name=original_txn.attendant_name,
        attendant_phone=original_txn.attendant_phone,

        manager_name=original_txn.manager_name,
        manager_phone=original_txn.manager_phone,
    )

    # -----------------------------------
    # REVERSE POINTS HISTORY
    # -----------------------------------
    original_entries = PointsHistory.objects.filter(
        transaction=original_txn,
        reversal__isnull=True
    )

    running_balance = customer.total_points if customer else Decimal("0.00")

    for entry in original_entries:
        delta = -entry.points_change
        running_balance += delta

        PointsHistory.objects.create(
            customer=entry.customer,
            transaction=reversed_txn,

            customer_name=entry.customer_name,
            customer_mobile=entry.customer_mobile,

            points_change=delta,
            balance_after=running_balance,

            type="reversal",
            reversed_from=entry
        )

    return reversed_txn
