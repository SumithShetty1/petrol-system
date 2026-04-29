from django.db.models import Sum, Count, Q
from transactions.models import Transaction
from datetime import datetime, time
from django.utils import timezone
from pumps.models import Pump
from accounts.models import User


def to_datetime_range(start_date, end_date):
    return (
        timezone.make_aware(datetime.combine(start_date, time.min)),
        timezone.make_aware(datetime.combine(end_date, time.max))
    )


# ---------------------------------------------------
# BASE FILTER (CRITICAL FIX)
# ---------------------------------------------------
def valid_transactions(queryset):
    return queryset.filter(
        transaction_type="normal",
        reversal_entry__isnull=True
    )


# ---------------------------------------------------
# ADMIN DASHBOARD
# ---------------------------------------------------
def admin_sales_summary(start_date=None, end_date=None):

    queryset = valid_transactions(Transaction.objects.all())

    if start_date and end_date:
        start_datetime, end_datetime = to_datetime_range(start_date, end_date)

        queryset = queryset.filter(
            created_at__range=[start_datetime, end_datetime]
        )

    totals = queryset.aggregate(
        total_sales=Sum("final_amount"),
        total_quantity=Sum("quantity"),
        credits_earned=Sum("points_earned"),
        credits_redeemed=Sum("points_used"),
    )

    fuel = queryset.values("fuel_type").annotate(
        sales=Sum("final_amount"),
        quantity=Sum("quantity"),
    )

    petrol_sales = diesel_sales = 0
    petrol_quantity = diesel_quantity = 0

    for item in fuel:
        if item["fuel_type"] == "petrol":
            petrol_sales = item["sales"] or 0
            petrol_quantity = item["quantity"] or 0
        elif item["fuel_type"] == "diesel":
            diesel_sales = item["sales"] or 0
            diesel_quantity = item["quantity"] or 0

    return {
        "total_sales": totals["total_sales"] or 0,
        "total_quantity": totals["total_quantity"] or 0,
        "petrol_sales": petrol_sales,
        "diesel_sales": diesel_sales,
        "petrol_quantity": petrol_quantity,
        "diesel_quantity": diesel_quantity,
        "credits_earned": totals["credits_earned"] or 0,
        "credits_redeemed": totals["credits_redeemed"] or 0,
        "total_pumps": Pump.objects.count(),
        "total_owners": User.objects.filter(role="owner").count(),
    }


# ---------------------------------------------------
# OWNER DASHBOARD
# ---------------------------------------------------
def owner_sales_summary(owner, start_date=None, end_date=None):

    pumps = Pump.objects.filter(owner=owner)
    pump_codes_qs = pumps.values_list("pump_code", flat=True)

    queryset = valid_transactions(
        Transaction.objects.filter(
            Q(pump__owner=owner) |
            Q(pump_code__in=pump_codes_qs)
        ).distinct()
    )

    if start_date and end_date:
        start_datetime, end_datetime = to_datetime_range(start_date, end_date)
        queryset = queryset.filter(created_at__range=[start_datetime, end_datetime])

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

    petrol_sales = diesel_sales = 0
    petrol_quantity = diesel_quantity = 0

    for item in fuel:
        if item["fuel_type"] == "petrol":
            petrol_sales = item["sales"] or 0
            petrol_quantity = item["quantity"] or 0
        elif item["fuel_type"] == "diesel":
            diesel_sales = item["sales"] or 0
            diesel_quantity = item["quantity"] or 0

    return {
        "total_sales": totals["total_sales"] or 0,
        "total_quantity": totals["total_quantity"] or 0,
        "petrol_sales": petrol_sales,
        "diesel_sales": diesel_sales,
        "petrol_quantity": petrol_quantity,
        "diesel_quantity": diesel_quantity,
        "credits_earned": totals["credits_earned"] or 0,
        "credits_redeemed": totals["credits_redeemed"] or 0,
        "total_pumps": pumps.count()
    }


# ---------------------------------------------------
# PUMP DASHBOARD
# ---------------------------------------------------
def pump_sales_summary(pump, start_date=None, end_date=None):

    queryset = valid_transactions(
        Transaction.objects.filter(
            Q(pump=pump) |
            Q(pump_code=pump.pump_code)
        ).distinct()
    )

    if start_date and end_date:
        start_datetime, end_datetime = to_datetime_range(start_date, end_date)
        queryset = queryset.filter(created_at__range=[start_datetime, end_datetime])

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

    petrol_sales = diesel_sales = 0
    petrol_quantity = diesel_quantity = 0

    for item in fuel:
        if item["fuel_type"] == "petrol":
            petrol_sales = item["sales"] or 0
            petrol_quantity = item["quantity"] or 0
        elif item["fuel_type"] == "diesel":
            diesel_sales = item["sales"] or 0
            diesel_quantity = item["quantity"] or 0

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
# ATTENDANT DASHBOARD
# ---------------------------------------------------
def attendant_sales_summary(attendant, start_date=None, end_date=None):

    phone = attendant.user.username

    queryset = valid_transactions(
        Transaction.objects.filter(attendant_phone=phone)
    )

    if start_date and end_date:
        start_datetime, end_datetime = to_datetime_range(start_date, end_date)
        queryset = queryset.filter(created_at__range=[start_datetime, end_datetime])

    result = queryset.aggregate(
        total_sales=Sum("final_amount"),
        total_quantity=Sum("quantity"),
        total_transactions=Count("id")
    )

    fuel = queryset.values("fuel_type").annotate(
        litres=Sum("quantity"),
        amount=Sum("final_amount")
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
