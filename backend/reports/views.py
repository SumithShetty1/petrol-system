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
    pump_sales_summary,
    attendant_sales_summary
)


class DashboardView(APIView):

    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get(self, request, pump_id):

        pump = get_object_or_404(Pump, id=pump_id)

        filter_type = request.query_params.get("range", "today")

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

        data = pump_sales_summary(pump, start_date, end_date)

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

        data = attendant_sales_summary(employee, start_date, end_date)

        return Response(data)
    