from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta, datetime

from accounts.permissions import IsAdminOwnerManager
from pumps.models import Pump
from employees.models import Employee

from .services import (
    pump_sales_summary,
    attendant_sales_summary
)


class PumpDashboardView(APIView):

    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get(self, request):

        employee = Employee.objects.select_related("pump").filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee not found"}, status=404)

        pump = employee.pump

        filter_type = request.query_params.get("range", "today")

        end_date = timezone.localtime().date()

        if filter_type == "today":
            start_date = end_date

        elif filter_type == "week":
            start_date = end_date - timedelta(days=7)

        elif filter_type == "month":
            start_date = end_date - timedelta(days=30)

        elif filter_type == "year":
            start_date = end_date - timedelta(days=365)

        elif filter_type == "custom":
            try:
                start_date = datetime.strptime(
                    request.query_params.get("start_date"), "%Y-%m-%d"
                ).date()

                end_date = datetime.strptime(
                    request.query_params.get("end_date"), "%Y-%m-%d"
                ).date()
            except:
                return Response({"error": "Invalid date format"}, status=400)

        data = pump_sales_summary(pump, start_date, end_date)

        return Response(data)
    

class MyAttendantDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        employee = Employee.objects.filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee not found"}, status=404)

        filter_type = request.query_params.get("range", "today")

        start_date = None
        end_date = timezone.localtime().date()

        if filter_type == "today":
            start_date = end_date

        elif filter_type == "week":
            start_date = end_date - timedelta(days=7)

        elif filter_type == "month":
            start_date = end_date - timedelta(days=30)

        elif filter_type == "year":
            start_date = end_date - timedelta(days=365)

        elif filter_type == "custom":
            try:
                start_date = datetime.strptime(
                    request.query_params.get("start_date"), "%Y-%m-%d"
                ).date()

                end_date = datetime.strptime(
                    request.query_params.get("end_date"), "%Y-%m-%d"
                ).date()
            except:
                return Response({"error": "Invalid date format"}, status=400)
            
        data = attendant_sales_summary(employee, start_date, end_date)

        return Response(data)
    

class AttendantDashboardDetailView(APIView):

    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get(self, request, attendant_id):

        # Get manager's employee record
        manager_employee = Employee.objects.select_related("pump").filter(user=request.user).first()

        if not manager_employee:
            return Response({"error": "Manager not found"}, status=404)

        # Get requested attendant
        attendant = get_object_or_404(
            Employee.objects.select_related("pump", "user"),
            id=attendant_id,
            user__role="attendant"
        )

        if attendant.pump != manager_employee.pump:
            return Response({"error": "Unauthorized"}, status=403)

        filter_type = request.query_params.get("range", "today")

        end_date = timezone.localtime().date()

        if filter_type == "today":
            start_date = end_date

        elif filter_type == "week":
            start_date = end_date - timedelta(days=7)

        elif filter_type == "month":
            start_date = end_date - timedelta(days=30)

        elif filter_type == "year":
            start_date = end_date - timedelta(days=365)

        elif filter_type == "custom":
            try:
                start_date = datetime.strptime(
                    request.query_params.get("start_date"), "%Y-%m-%d"
                ).date()

                end_date = datetime.strptime(
                    request.query_params.get("end_date"), "%Y-%m-%d"
                ).date()
            except:
                return Response({"error": "Invalid date format"}, status=400)

        data = attendant_sales_summary(attendant, start_date, end_date)

        return Response(data)
    