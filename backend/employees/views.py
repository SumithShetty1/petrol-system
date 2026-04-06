from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminOwnerManager

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_queryset(self):
        user = self.request.user

        # Admin sees all employees
        if user.role == "admin":
            return Employee.objects.all()

        # Owner sees employees of their pumps
        if user.role == "owner":
            return Employee.objects.filter(pump__owner=user)

        # Manager sees employees of their pump
        if user.role == "manager":
            employee = Employee.objects.filter(user=user).first()

            if employee:
                return Employee.objects.filter(pump=employee.pump)

        return Employee.objects.none()
