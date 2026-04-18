from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsAdminOwnerManager

from .models import Employee
from .serializers import EmployeeSerializer


# -------------------------------
# Employee ViewSet (General)
# -------------------------------
class EmployeeViewSet(viewsets.ModelViewSet):
    
    queryset = Employee.objects.select_related("user", "pump")
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_queryset(self):
        user = self.request.user

        # Admin → all employees
        if user.role == "admin":
            return Employee.objects.all()

        # Owner → employees of their pumps
        if user.role == "owner":
            return Employee.objects.filter(pump__owner=user)

        # Manager → employees of their pump
        if user.role == "manager":
            employee = Employee.objects.select_related("pump").filter(user=user).first()

            if employee:
                return Employee.objects.filter(pump=employee.pump)

        return Employee.objects.none()


# -------------------------------
# Attendants List API
# -------------------------------
class AttendantListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # Admin → all attendants
        if user.role == "admin":
            attendants = Employee.objects.filter(user__role="attendant")

        # Owner → attendants of owned pumps
        elif user.role == "owner":
            attendants = Employee.objects.filter(
                pump__owner=user,
                user__role="attendant"
            )

        # Manager → attendants of their pump
        elif user.role == "manager":
            employee = Employee.objects.select_related("pump").filter(user=user).first()

            if not employee:
                return Response([])

            attendants = Employee.objects.filter(
                pump=employee.pump,
                user__role="attendant"
            )

        else:
            attendants = Employee.objects.none()

        serializer = EmployeeSerializer(attendants, many=True)
        return Response(serializer.data)


# -------------------------------
# Profile API (Attendant/Manager)
# -------------------------------
class EmployeeProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        employee = Employee.objects.select_related("pump").filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee not found"}, status=404)

        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    