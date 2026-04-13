from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal

from customers.models import Customer, PointsHistory
from fuel.models import FuelRate
from .models import Transaction
from pumps.models import Pump


POINT_RATE = Decimal("0.1")   # ₹1 = 0.1 points
POINT_REDEEM_VALUE = Decimal("0.1")   # 1 point = ₹0.1

@transaction.atomic
def process_transaction(data, attendant):

    mobile = data["mobile_number"]
    pump = get_object_or_404(Pump, id=data["pump"])
    fuel_type = data["fuel_type"]

    original_amount = Decimal(data["amount"])
    amount = original_amount

    if amount < 0:
        raise ValueError("Transaction amount cannot be negative")
    
    redeem_points = Decimal(data.get("redeem_points", 0))

    if redeem_points < 0:
        raise ValueError("Redeem points cannot be negative")

    manager = pump.manager

    # Get or create customer
    customer, _ = Customer.objects.select_for_update().get_or_create(
        mobile_number=mobile,
        defaults={"name": data.get("name", "Customer")}
    )

    # Get fuel rate
    fuel_rate = get_object_or_404(
        FuelRate,
        pump=pump,
        fuel_type=fuel_type
    )

    price = fuel_rate.price_per_litre

    # Calculate quantity
    quantity = original_amount / price

    # Redemption logic
    points_used = Decimal("0")

    if redeem_points > 0 and customer.total_points >= redeem_points:
        points_used = redeem_points
        redeem_value = redeem_points * POINT_REDEEM_VALUE
        
        if redeem_value > amount:
            redeem_value = amount

        amount = amount - redeem_value

    # Points earned
    points_earned = amount * POINT_RATE
    
    # Update customer points
    remaining_points = customer.total_points - points_used + points_earned

    customer.total_points = remaining_points
    customer.save()

    # Create transaction
    transaction = Transaction.objects.create(
        customer=customer,
        pump=pump,
        attendant=attendant,
        manager=manager,

        fuel_type=fuel_type,

        original_amount=original_amount,
        final_amount=amount,
        quantity=quantity,

        points_used=points_used,
        points_earned=points_earned,
        remaining_points=remaining_points,

        customer_name=customer.name,
        customer_mobile=customer.mobile_number,

        pump_name=pump.pump_name,
        pump_location=pump.location,

        attendant_name=attendant.user.get_full_name() or attendant.user.username,
        attendant_phone=attendant.user.username,

        manager_name=(
            manager.user.get_full_name() or manager.user.username
            if manager else None
        ),
        manager_phone=(
            manager.user.username
            if manager else None
        ),
    )

    # Record points history
    # Earn
    if points_earned > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,
            points_change=points_earned,
            balance_after=remaining_points,
            type="earn"
        )

    # Redeem
    if points_used > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,
            points_change=-points_used,
            balance_after=remaining_points,
            type="redeem"
        )

    return transaction

