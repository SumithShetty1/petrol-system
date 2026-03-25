from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsOwnerOrManager

from .models import FuelRate
from .serializers import FuelRateSerializer


class FuelRateViewSet(viewsets.ModelViewSet):

    queryset = FuelRate.objects.all()
    serializer_class = FuelRateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrManager]

