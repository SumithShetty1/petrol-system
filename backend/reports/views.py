from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from accounts.permissions import IsAdminOwnerManager
from pumps.models import Pump

from .services import (
    today_sales,
    weekly_sales,
    monthly_sales,
    yearly_sales,
    custom_date_sales,
    monthly_filter,
    yearly_filter,
    fuel_sales,
    attendant_performance
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
    
