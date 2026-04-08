from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from accounts.permissions import IsAdminOwnerManager
from pumps.models import Pump
from employees.models import Employee

from .services import (
    today_sales,
    weekly_sales,
    monthly_sales,
    yearly_sales,
    custom_date_sales,
    monthly_filter,
    yearly_filter,
    fuel_sales,
    attendant_performance,
    attendant_sales
)


class DashboardView(APIView):

    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get(self, request, pump_id):

        pump = get_object_or_404(Pump, id=pump_id)

        # query params
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        month = request.query_params.get("month")
        year = request.query_params.get("year")

        month = int(month) if month else None
        year = int(year) if year else None

        data = {
            "today": today_sales(pump),
            "weekly": weekly_sales(pump),
            "monthly": monthly_sales(pump),
            "yearly": yearly_sales(pump),
            "fuel_sales": fuel_sales(pump),
            "attendant_performance": list(attendant_performance(pump))
        }

        # custom date range
        if start_date and end_date:
            data["custom_range"] = custom_date_sales(pump, start_date, end_date)

        # specific month filter
        if month and year:
            data["selected_month"] = monthly_filter(pump, month, year)

        # specific year filter
        if year:
            data["selected_year"] = yearly_filter(pump, year)

        return Response(data)
    

class AttendantDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        employee = Employee.objects.filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee not found"}, status=404)

        filter_type = request.query_params.get("range", "today")

        start_date = None
        end_date = timezone.now().date()

        if filter_type == "today":
            start_date = end_date

        elif filter_type == "week":
            start_date = end_date - timedelta(days=7)

        elif filter_type == "month":
            start_date = end_date - timedelta(days=30)

        elif filter_type == "year":
            start_date = end_date - timedelta(days=365)

        elif filter_type == "custom":
            start_date = request.query_params.get("start_date")
            end_date = request.query_params.get("end_date")

        data = attendant_sales(employee, start_date, end_date)

        return Response(data)
    