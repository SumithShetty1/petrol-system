from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOwnerManager, IsAttendant
from employees.models import Employee
from .serializers import TransactionCreateSerializer, TransactionListSerializer
from .services import process_transaction

from rest_framework import viewsets
from .models import Transaction

from datetime import timedelta, datetime, time
from django.utils import timezone


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

        serializer = TransactionCreateSerializer(transaction)

        return Response(serializer.data)
    

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Transaction.objects.select_related(
        "customer",
        "pump",
        "attendant",
        "manager"
    )

    serializer_class = TransactionListSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_serializer_context(self):
        return {"request": self.request}
    
    def get_queryset(self):
        queryset = super().get_queryset()

        user = self.request.user

        # Get employee
        employee = Employee.objects.select_related("pump").filter(user=user).first()

        if not employee:
            return Transaction.objects.none()

        # Role-based filtering
        if user.role == "admin":
            pass  # full access

        elif user.role == "owner":
            queryset = queryset.filter(pump__owner=user)

        elif user.role == "manager":
            queryset = queryset.filter(pump=employee.pump)

        elif user.role == "attendant":
            queryset = queryset.filter(attendant=employee)

        else:
            return Transaction.objects.none()

        # Attendant filter
        attendant_id = self.request.query_params.get("attendant")

        if attendant_id:
            queryset = queryset.filter(attendant_id=attendant_id)

        # Fuel filter
        fuel_type = self.request.query_params.get("fuel")

        if fuel_type and fuel_type != "all":
            queryset = queryset.filter(fuel_type=fuel_type)
        
        # Date filtering
        range_type = self.request.query_params.get("range")
        today = timezone.localtime().date()

        if range_type == "today":
            queryset = queryset.filter(created_at__date=today)

        elif range_type == "week":
            start = today - timedelta(days=7)
            queryset = queryset.filter(created_at__date__gte=start)

        elif range_type == "month":
            start = today - timedelta(days=30)
            queryset = queryset.filter(created_at__date__gte=start)

        elif range_type == "year":
            start = today - timedelta(days=365)
            queryset = queryset.filter(created_at__date__gte=start)

        elif range_type == "custom":
            start_date = self.request.query_params.get("start_date")
            end_date = self.request.query_params.get("end_date")

            if start_date and end_date:
                start_datetime = timezone.make_aware(
                    datetime.combine(datetime.strptime(start_date, "%Y-%m-%d"), time.min)
                )

                end_datetime = timezone.make_aware(
                    datetime.combine(datetime.strptime(end_date, "%Y-%m-%d"), time.max)
                )

                queryset = queryset.filter(
                    created_at__range=[start_datetime, end_datetime]
                )

        return queryset.order_by("-created_at")
    
