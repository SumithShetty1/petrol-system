from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdmin

from .models import Pump
from .serializers import PumpSerializer


class PumpViewSet(viewsets.ModelViewSet):

    queryset = Pump.objects.all()
    serializer_class = PumpSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

