from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsOwnerOrManager

from .models import FuelRate
from .serializers import FuelRateSerializer


class FuelRateViewSet(viewsets.ModelViewSet):
   
    queryset = FuelRate.objects.all()
    serializer_class = FuelRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = FuelRate.objects.all()

        pump_id = self.request.query_params.get("pump")

        if pump_id:
            queryset = queryset.filter(pump_id=pump_id)

        return queryset


    def get_permissions(self):

        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsOwnerOrManager]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    