from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404
from django.utils import timezone

from datetime import timedelta, datetime

from accounts.permissions import (
    IsAttendant,
    IsManager,
    IsOwner
)

from employees.models import Employee
from pumps.models import Pump

from .services import (
    pump_sales_summary,
    attendant_sales_summary,
    owner_sales_summary
)


# -----------------------------------
# SHARED DATE RANGE HELPER
# -----------------------------------
def get_date_range(request):

    filter_type = request.query_params.get(
        "range",
        "today"
    )

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
                request.query_params.get(
                    "start_date"
                ),
                "%Y-%m-%d"
            ).date()

            end_date = datetime.strptime(
                request.query_params.get(
                    "end_date"
                ),
                "%Y-%m-%d"
            ).date()

        except ValueError:
            return None, None
        
        if start_date > end_date:
            return None, None

    else:
        start_date = end_date

    return start_date, end_date


# -----------------------------------
# OWNER OVERALL DASHBOARD
# -----------------------------------
class OwnerDashboardView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsOwner
    ]

    def get(self, request):

        start_date, end_date = get_date_range(
            request
        )

        if start_date is None:
            return Response(
                {
                    "error":
                    "Invalid date format"
                },
                status=400
            )

        data = owner_sales_summary(
            request.user,
            start_date,
            end_date
        )

        return Response(data)


# -----------------------------------
# OWNER SINGLE PUMP DASHBOARD
# Uses pump_code
# -----------------------------------
class OwnerPumpDetailDashboardView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsOwner
    ]

    def get(
        self,
        request,
        pump_code
    ):

        pump = get_object_or_404(
            Pump,
            pump_code=pump_code,
            owner=request.user
        )

        start_date, end_date = get_date_range(
            request
        )

        if start_date is None:
            return Response(
                {
                    "error":
                    "Invalid date format"
                },
                status=400
            )

        data = pump_sales_summary(
            pump,
            start_date,
            end_date
        )

        return Response(data)


# -----------------------------------
# MANAGER PUMP DASHBOARD
# Uses assigned pump_code internally
# -----------------------------------
class PumpDashboardView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsManager
    ]

    def get(self, request):

        employee = Employee.objects.select_related(
            "pump"
        ).filter(
            user=request.user
        ).first()

        if not employee:
            return Response(
                {
                    "error":
                    "Employee not found"
                },
                status=404
            )

        if not employee.pump:
            return Response(
                {
                    "error":
                    "Pump not assigned"
                },
                status=404
            )

        start_date, end_date = get_date_range(
            request
        )

        if start_date is None:
            return Response(
                {
                    "error":
                    "Invalid date format"
                },
                status=400
            )

        data = pump_sales_summary(
            employee.pump,
            start_date,
            end_date
        )

        return Response(data)


# -----------------------------------
# ATTENDANT SELF DASHBOARD
# Uses attendant_phone internally
# -----------------------------------
class MyAttendantDashboardView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsAttendant
    ]

    def get(self, request):

        employee = Employee.objects.select_related(
            "user"
        ).filter(
            user=request.user
        ).first()

        if not employee:
            return Response(
                {
                    "error":
                    "Employee not found"
                },
                status=404
            )

        start_date, end_date = get_date_range(
            request
        )

        if start_date is None:
            return Response(
                {
                    "error":
                    "Invalid date format"
                },
                status=400
            )

        data = attendant_sales_summary(
            employee,
            start_date,
            end_date
        )

        return Response(data)


# -----------------------------------
# MANAGER VIEW ATTENDANT DASHBOARD
# Uses phone number instead of id
# -----------------------------------
class AttendantDashboardDetailView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsManager
    ]

    def get(
        self,
        request,
        phone
    ):

        manager_employee = Employee.objects.select_related(
            "pump"
        ).filter(
            user=request.user
        ).first()

        if not manager_employee:
            return Response(
                {
                    "error":
                    "Manager not found"
                },
                status=404
            )

        attendant = get_object_or_404(
            Employee.objects.select_related(
                "pump",
                "user"
            ),
            user__username=phone,
            user__role="attendant"
        )

        if attendant.pump != manager_employee.pump:
            return Response(
                {
                    "error":
                    "Unauthorized"
                },
                status=403
            )

        start_date, end_date = get_date_range(
            request
        )

        if start_date is None:
            return Response(
                {
                    "error":
                    "Invalid date format"
                },
                status=400
            )

        data = attendant_sales_summary(
            attendant,
            start_date,
            end_date
        )

        return Response(data)
    