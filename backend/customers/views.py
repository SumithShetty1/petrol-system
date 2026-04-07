from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsManagerOrAttendant

from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAttendant]

    def get_queryset(self):

        queryset = Customer.objects.all()

        mobile = self.request.query_params.get("mobile_number")

        if mobile:
            queryset = queryset.filter(mobile_number=mobile)

        return queryset
    