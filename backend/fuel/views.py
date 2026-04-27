from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from accounts.permissions import IsOwnerOrManager

from .models import FuelRate
from .serializers import FuelRateSerializer

from employees.models import Employee


class FuelRateViewSet(viewsets.ModelViewSet):
   
    queryset = FuelRate.objects.all()
    serializer_class = FuelRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = FuelRate.objects.select_related("pump")

        if user.role == "owner":
            return queryset.filter(
                pump__owner=user
            )

        if user.role in ["manager", "attendant"]:
            employee = Employee.objects.select_related(
                "pump"
            ).filter(user=user).first()
    
            if employee and employee.pump:
                return queryset.filter(
                    pump=employee.pump
                )

        return FuelRate.objects.none()
    

    def get_permissions(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy"
        ]:
            return [
                IsAuthenticated(),
                IsOwnerOrManager()
            ]

        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        user = self.request.user

        if user.role == "manager":
            employee = Employee.objects.select_related("pump").get(user=user)
            
            if not employee.pump:
                raise PermissionDenied("Pump not assigned")

            serializer.save(pump=employee.pump)

        elif user.role == "owner":
            pump = serializer.validated_data["pump"]

            if pump.owner != user:
                raise PermissionDenied("Unauthorized pump")

            serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        fuel_rate = self.get_object()

        if user.role == "manager":
            employee = Employee.objects.select_related("pump").filter(user=user).first()
            
            if not employee or not employee.pump:
                raise PermissionDenied("Pump not assigned")

            if fuel_rate.pump != employee.pump:
                raise PermissionDenied("Unauthorized")

        elif user.role == "owner":
            if fuel_rate.pump.owner != user:
                raise PermissionDenied("Unauthorized")

        serializer.save()
        