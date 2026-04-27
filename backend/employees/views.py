from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import (
    IsAdminOwnerManager,
    IsAdminOrOwner,
    IsManagerOrAttendant,
)

from .models import Employee

from .serializers import (
    EmployeeListSerializer,
    EmployeeProfileSerializer,
)


# -----------------------------------
# SHARED QUERYSET
# -----------------------------------
def employee_queryset():
    return Employee.objects.select_related(
        "user",
        "owner",
        "pump",
        "pump__manager",
        "pump__manager__user",
    )


# -----------------------------------
# EMPLOYEE VIEWSET
# -----------------------------------
class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    queryset = employee_queryset()

    def get_serializer_class(self):
        if self.action == "list":
            return EmployeeListSerializer

        return EmployeeProfileSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = employee_queryset()

        # Admin
        if user.role == "admin":
            return queryset

        # Owner
        if user.role == "owner":
            return queryset.filter(owner=user)

        # Manager
        if user.role == "manager":
            manager_emp = queryset.filter(
                user=user
            ).first()

            if manager_emp and manager_emp.pump:
                return queryset.filter(
                    pump=manager_emp.pump
                )

        return Employee.objects.none()


# -----------------------------------
# ATTENDANTS LIST
# -----------------------------------
class AttendantListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    def get(self, request):
        user = request.user
        queryset = employee_queryset()

        # Admin
        if user.role == "admin":
            attendants = queryset.filter(
                user__role="attendant"
            )

        # Owner
        elif user.role == "owner":
            attendants = queryset.filter(
                owner=user,
                user__role="attendant"
            )

        # Manager
        elif user.role == "manager":
            manager_emp = queryset.filter(
                user=user
            ).first()

            if not manager_emp or not manager_emp.pump:
                return Response([])

            attendants = queryset.filter(
                pump=manager_emp.pump,
                user__role="attendant"
            )

        else:
            attendants = Employee.objects.none()

        serializer = EmployeeListSerializer(
            attendants,
            many=True
        )

        return Response(serializer.data)


# -----------------------------------
# MANAGERS LIST
# -----------------------------------
class ManagerListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrOwner
    ]

    def get(self, request):
        user = request.user
        queryset = employee_queryset()

        # Admin
        if user.role == "admin":
            managers = queryset.filter(
                user__role="manager"
            )

        # Owner
        elif user.role == "owner":
            managers = queryset.filter(
                owner=user,
                user__role="manager"
            )

        else:
            managers = Employee.objects.none()

        serializer = EmployeeListSerializer(
            managers,
            many=True
        )

        return Response(serializer.data)


# -----------------------------------
# EMPLOYEE PROFILE
# -----------------------------------
class EmployeeProfileView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsManagerOrAttendant
    ]

    def get(self, request):

        employee = employee_queryset().filter(
            user=request.user
        ).first()

        if not employee:
            return Response(
                {"error": "Employee not found"},
                status=404
            )

        serializer = EmployeeProfileSerializer(
            employee
        )

        return Response(serializer.data)
    