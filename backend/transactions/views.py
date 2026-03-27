from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAttendant
from employees.models import Employee
from .serializers import TransactionSerializer
from .services import process_transaction


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
    