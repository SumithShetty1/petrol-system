from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from transactions.models import Transaction


# ---------------------------------------------------
# Pump Level Analytics
# ---------------------------------------------------

def today_sales(pump):

    today = timezone.now().date()

    result = Transaction.objects.filter(
        pump=pump,
        created_at__date=today
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def weekly_sales(pump):

    start_date = timezone.now() - timedelta(days=7)

    result = Transaction.objects.filter(
        pump=pump,
        created_at__gte=start_date
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def monthly_sales(pump):

    start_date = timezone.now() - timedelta(days=30)

    result = Transaction.objects.filter(
        pump=pump,
        created_at__gte=start_date
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def yearly_sales(pump):

    start_date = timezone.now() - timedelta(days=365)

    result = Transaction.objects.filter(
        pump=pump,
        created_at__gte=start_date
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def custom_date_sales(pump, start_date, end_date):

    result = Transaction.objects.filter(
        pump=pump,
        created_at__date__range=[start_date, end_date]
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def monthly_filter(pump, month, year):

    result = Transaction.objects.filter(
        pump=pump,
        created_at__month=month,
        created_at__year=year
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def yearly_filter(pump, year):

    result = Transaction.objects.filter(
        pump=pump,
        created_at__year=year
    ).aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity")
    )

    return {
        "total_sales": result["total_sales"] or 0,
        "total_quantity": result["total_quantity"] or 0
    }


def fuel_sales(pump):

    data = (
        Transaction.objects
        .filter(pump=pump)
        .values("fuel_type")
        .annotate(total_sales=Sum("amount"))
    )

    result = {
        "petrol_sales": 0,
        "diesel_sales": 0
    }

    for item in data:
        result[f"{item['fuel_type']}_sales"] = item["total_sales"] or 0

    return result


def attendant_performance(pump):

    return (
        Transaction.objects
        .filter(pump=pump)
        .values("attendant__name")
        .annotate(
            total_sales=Sum("amount"),
            total_transactions=Count("id")
        )
        .order_by("-total_sales")
    )


# ---------------------------------------------------
# Attendant Performance (Pump Level)
# ---------------------------------------------------

def attendant_performance(pump):

    return (
        Transaction.objects
        .filter(pump=pump)
        .values("attendant__name")
        .annotate(
            total_sales=Sum("amount"),
            total_transactions=Count("id")
        )
        .order_by("-total_sales")
    )


# ---------------------------------------------------
# Attendant Personal Dashboard
# ---------------------------------------------------

def attendant_sales(attendant, start_date=None, end_date=None):

    queryset = Transaction.objects.filter(attendant=attendant)

    if start_date and end_date:
        queryset = queryset.filter(
            created_at__date__range=[start_date, end_date]
        )

    result = queryset.aggregate(
        total_sales=Sum("amount"),
        total_quantity=Sum("quantity"),
        total_transactions=Count("id")
    )

    fuel = (
        queryset
        .values("fuel_type")
        .annotate(
            litres=Sum("quantity"),
            amount=Sum("amount")
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
