from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOwnerManager

from .models import Pump
from .serializers import PumpSerializer


class PumpViewSet(viewsets.ModelViewSet):

    queryset = Pump.objects.all()
    serializer_class = PumpSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_queryset(self):
        user = self.request.user

        # Admin → all pumps
        if user.role == "admin":
            return Pump.objects.all()

        # Owner → only owned pumps
        if user.role == "owner":
            return Pump.objects.filter(owner=user)

        # Manager → only assigned pump
        if user.role == "manager":
            employee = user.employee_profile.first()

            if employee and employee.pump:
                return Pump.objects.filter(id=employee.pump.id)

        return Pump.objects.none()
    