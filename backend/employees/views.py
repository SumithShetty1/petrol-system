from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsAdminOwnerManager

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    
    queryset = Employee.objects.select_related("user", "pump")
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
            employee = Employee.objects.select_related("pump").filter(user=user).first()

            if employee:
                return Employee.objects.filter(pump=employee.pump)

        return Employee.objects.none()


class AttendantProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        employee = Employee.objects.select_related("pump").filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee not found"}, status=404)

        pump = employee.pump

        data = {
            "name": request.user.get_full_name(),
            "phone": request.user.username,
            "role": request.user.role,
            "pump_name": pump.pump_name,
            "location": pump.location
        }

        return Response(data)
    