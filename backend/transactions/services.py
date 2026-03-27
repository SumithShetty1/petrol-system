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
    amount = Decimal(data["amount"])

    if amount <= 0:
        raise ValueError("Transaction amount must be greater than zero")
    
    redeem_points = Decimal(data.get("redeem_points", 0))

    if redeem_points < 0:
        raise ValueError("Redeem points cannot be negative")

    # Get or create customer
    customer, created = Customer.objects.get_or_create(
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
    quantity = amount / price

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

    # Create transaction
    transaction = Transaction.objects.create(
        customer=customer,
        pump=pump,
        attendant=attendant,
        fuel_type=fuel_type,
        amount=amount,
        quantity=quantity,
        points_used=points_used,
        points_earned=points_earned
    )

    # Update customer points
    customer.total_points = customer.total_points - points_used + points_earned
    customer.save()

    # Record points history
    if points_earned > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,
            points_change=points_earned,
            type="earn"
        )

    if points_used > 0:
        PointsHistory.objects.create(
            customer=customer,
            transaction=transaction,
            points_change=points_used,
            type="redeem"
        )

    return transaction

