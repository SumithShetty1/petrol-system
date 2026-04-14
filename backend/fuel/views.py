from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
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
    
        employee = Employee.objects.select_related("pump").filter(user=user).first()
    
        if not employee:
            return FuelRate.objects.none()
    
        return FuelRate.objects.filter(pump=employee.pump)


    def get_permissions(self):

        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsOwnerOrManager]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    