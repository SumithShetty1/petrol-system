from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOwnerManager, IsAttendant
from employees.models import Employee
from .serializers import TransactionSerializer
from .services import process_transaction

from rest_framework import viewsets
from .models import Transaction

class CreateTransactionView(APIView):

    permission_classes = [IsAuthenticated, IsAttendant]

    def post(self, request):

        employee = Employee.objects.filter(user=request.user).first()

        if not employee:
            return Response({"error": "Employee profile not found"}, status=400)

        transaction = process_transaction(
            request.data,
            employee
        )

        serializer = TransactionSerializer(transaction)

        return Response(serializer.data)
    

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Transaction.objects.all().select_related(
        "customer",
        "pump",
        "attendant"
    )

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_queryset(self):

        queryset = super().get_queryset()

        pump_id = self.request.query_params.get("pump")

        if pump_id:
            queryset = queryset.filter(pump_id=pump_id)

        return queryset.order_by("-created_at")
    
