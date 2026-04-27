from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal

from customers.models import (
    Customer,
    PointsHistory
)

from fuel.models import FuelRate
from .models import Transaction


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

    fuel_type = data["fuel_type"]

    original_amount = Decimal(
        data["amount"]
    )

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

    if redeem_points < 0:
        raise ValueError(
            "Redeem points cannot be negative"
        )

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
    # REDEEM LOGIC
    # -----------------------------------
    points_used = Decimal("0")

    if (
        redeem_points > 0 and
        customer.total_points >= redeem_points
    ):
        points_used = redeem_points

        redeem_value = (
            redeem_points * POINT_REDEEM_VALUE
        ).quantize(Decimal("0.01"))

        if redeem_value > amount:
            redeem_value = amount

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
