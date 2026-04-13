from django.db.models import Sum, Count

from transactions.models import Transaction

from datetime import datetime, time
from django.utils import timezone


# ---------------------------------------------------
# Pump Level Analytics
# ---------------------------------------------------

def pump_sales_summary(pump, start_date=None, end_date=None):

    queryset = Transaction.objects.filter(pump=pump)

    if start_date and end_date:
        start_datetime = timezone.make_aware(datetime.combine(start_date, time.min))
        end_datetime = timezone.make_aware(datetime.combine(end_date, time.max))

        queryset = queryset.filter(
            created_at__range=[start_datetime, end_datetime]
        )

    totals = queryset.aggregate(
        total_sales=Sum("final_amount"),
        total_quantity=Sum("quantity"),
        credits_earned=Sum("points_earned"),
        credits_redeemed=Sum("points_used")
    )

    fuel = queryset.values("fuel_type").annotate(
        sales=Sum("final_amount"),
        quantity=Sum("quantity")
    )

    petrol_sales = 0
    diesel_sales = 0
    petrol_quantity = 0
    diesel_quantity = 0

    for f in fuel:
        if f["fuel_type"] == "petrol":
            petrol_sales = f["sales"] or 0
            petrol_quantity = f["quantity"] or 0
        elif f["fuel_type"] == "diesel":
            diesel_sales = f["sales"] or 0
            diesel_quantity = f["quantity"] or 0

    return {
        "total_sales": totals["total_sales"] or 0,
        "total_quantity": totals["total_quantity"] or 0,

        "petrol_sales": petrol_sales,
        "diesel_sales": diesel_sales,

        "petrol_quantity": petrol_quantity,
        "diesel_quantity": diesel_quantity,

        "credits_earned": totals["credits_earned"] or 0,
        "credits_redeemed": totals["credits_redeemed"] or 0,
    }


# ---------------------------------------------------
# Attendant Personal Dashboard
# ---------------------------------------------------

def attendant_sales_summary(attendant, start_date=None, end_date=None):

    queryset = Transaction.objects.filter(attendant=attendant)

    if start_date and end_date:
        start_datetime = timezone.make_aware(datetime.combine(start_date, time.min))
        end_datetime = timezone.make_aware(datetime.combine(end_date, time.max))
    
        queryset = queryset.filter(
            created_at__range=[start_datetime, end_datetime]
        )

    result = queryset.aggregate(
        total_sales=Sum("final_amount"),
        total_quantity=Sum("quantity"),
        total_transactions=Count("id")
    )

    fuel = (
        queryset
        .values("fuel_type")
        .annotate(
            litres=Sum("quantity"),
            amount=Sum("final_amount")
        )
    )

    fuel_breakdown = {
        "petrol": {"litres": 0, "amount": 0},
        "diesel": {"litres": 0, "amount": 0}
    }

    for item in fuel:
        fuel_breakdown[item["fuel_type"]] = {
            "litres": item["litres"] or 0,
            "amount": item["amount"] or 0
        }

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0,
        "total_transactions": result["total_transactions"] or 0,
        "fuel_breakdown": fuel_breakdown
    }
