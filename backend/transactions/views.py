from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from datetime import (
    timedelta,
    datetime,
    time
)

from django.utils import timezone
from django.db.models import Q

from accounts.permissions import (
    IsAdmin,
    IsAdminOwnerManager,
    IsAttendant
)

from employees.models import Employee
from pumps.models import Pump

from .models import Transaction
from .serializers import (
    TransactionCreateSerializer,
    TransactionListSerializer
)
from .services import (
    process_transaction
)

from .pagination import StandardResultsSetPagination

from django.http import HttpResponse
import openpyxl

# -----------------------------------
# CREATE TRANSACTION
# -----------------------------------
class CreateTransactionView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAttendant
    ]

    def post(self, request):

        employee = (
            Employee.objects
            .select_related(
                "user",
                "pump"
            )
            .filter(
                user=request.user
            )
            .first()
        )

        if not employee:
            return Response(
                {
                    "error":
                    "Employee profile not found"
                },
                status=400
            )

        try:
            transaction = process_transaction(request.data, employee)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        serializer = (
            TransactionCreateSerializer(
                transaction
            )
        )

        return Response(
            serializer.data
        )


# -----------------------------------
# TRANSACTION LIST
# -----------------------------------
class TransactionViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        Transaction.objects
        .select_related(
            "customer",
            "pump",
            "attendant",
            "manager"
        )
    )

    serializer_class = (
        TransactionListSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    pagination_class = StandardResultsSetPagination

    def get_serializer_context(self):
        return {
            "request":
            self.request
        }

    def get_queryset(self):

        queryset = super().get_queryset()

        user = self.request.user

        # -----------------------------------
        # QUERY PARAMS
        # -----------------------------------
        customer_mobile = (
            self.request
            .query_params
            .get("customer_mobile")
        )

        attendant_phone = (
            self.request
            .query_params
            .get("attendant")
        )

        pump_code = (
            self.request
            .query_params
            .get("pump")
        )

        fuel_type = (
            self.request
            .query_params
            .get("fuel")
        )

        range_type = (
            self.request
            .query_params
            .get(
                "range",
                "today"
            )
        )

        # -----------------------------------
        # ROLE FILTER
        # -----------------------------------
        if user.role == "admin":
            pass

        elif user.role == "owner":

            queryset = queryset.filter(
                Q(pump__owner=user) |
                Q(pump_code__in=Pump.objects.filter(owner=user).values("pump_code"))
            ).distinct()

        elif user.role == "manager":

            employee = (
                Employee.objects
                .select_related(
                    "pump"
                )
                .filter(
                    user=user
                )
                .first()
            )

            if not employee:
                return (
                    Transaction.objects.none()
                )

            # -----------------------------------
            # CUSTOMER LOOKUP
            # Show all pumps for searched customer
            # -----------------------------------
            if customer_mobile:
                queryset = queryset.filter(
                    customer_mobile=customer_mobile
                )

            # -----------------------------------
            # NORMAL MANAGER REPORT
            # Only own pump
            # -----------------------------------
            elif employee.pump:

                queryset = queryset.filter(
                    Q(pump=employee.pump) |
                    Q(pump_code=employee.pump.pump_code)
                ).distinct()

            else:
                return (
                    Transaction.objects.none()
                )

        elif user.role == "attendant":

            queryset = queryset.filter(
                Q(attendant__user=user) |
                Q(attendant_phone=user.username)
            )

        else:
            return (
                Transaction.objects.none()
            )
        
        # -----------------------------------
        # CUSTOMER FILTER
        # (Admin / Owner / Attendant)
        # Manager already handled above
        # -----------------------------------
        if (
            customer_mobile and
            user.role != "manager"
        ):
            queryset = queryset.filter(
                customer_mobile=customer_mobile
            )

        # -----------------------------------
        # ATTENDANT FILTER
        # -----------------------------------
        if (
            attendant_phone and
            attendant_phone != "all"
        ):
            queryset = queryset.filter(
                attendant_phone=attendant_phone
            )

        # -----------------------------------
        # PUMP FILTER
        # Admin / Owner only
        # -----------------------------------
        if (
            pump_code and
            pump_code != "all" and
            user.role in [
                "admin",
                "owner"
            ]
        ):
            queryset = queryset.filter(
                Q(pump__pump_code=pump_code) |
                Q(pump_code=pump_code)
            )

        # -----------------------------------
        # FUEL FILTER
        # -----------------------------------
        if (
            fuel_type and
            fuel_type != "all"
        ):
            queryset = queryset.filter(
                fuel_type=fuel_type
            )

        # -----------------------------------
        # DATE FILTER
        # -----------------------------------
        now = timezone.localtime()

        today = now.date()

        if range_type == "all":
            pass
        
        elif range_type == "today":
            start = timezone.make_aware(datetime.combine(today, time.min))
            end = timezone.make_aware(datetime.combine(today, time.max))

            queryset = queryset.filter(created_at__range=[start, end])

        elif range_type == "week":

            start_date = today - timedelta(days=today.weekday())

            start = timezone.make_aware(datetime.combine(start_date, time.min))
            end = timezone.make_aware(datetime.combine(today, time.max))

            queryset = queryset.filter(created_at__range=[start, end])

        elif range_type == "month":

            start_date = today - timedelta(days=30)

            start = timezone.make_aware(datetime.combine(start_date, time.min))
            end = timezone.make_aware(datetime.combine(today, time.max))

            queryset = queryset.filter(created_at__range=[start, end])

        elif range_type == "year":

            start_date = today - timedelta(days=365)

            start = timezone.make_aware(datetime.combine(start_date, time.min))
            end = timezone.make_aware(datetime.combine(today, time.max))
            
            queryset = queryset.filter(created_at__range=[start, end])

        elif range_type == "custom":

            start_date = (
                self.request
                .query_params
                .get("start_date")
            )

            end_date = (
                self.request
                .query_params
                .get("end_date")
            )

            if (
                start_date and
                end_date
            ):
                try:
                    start_datetime = (
                        timezone.make_aware(
                            datetime.combine(
                                datetime.strptime(
                                    start_date,
                                    "%Y-%m-%d"
                                ),
                                time.min
                            )
                        )
                    )

                    end_datetime = (
                        timezone.make_aware(
                            datetime.combine(
                                datetime.strptime(
                                    end_date,
                                    "%Y-%m-%d"
                                ),
                                time.max
                            )
                        )
                    )

                except ValueError:
                    return (
                        Transaction.objects.none()
                    )

                queryset = queryset.filter(
                    created_at__range=[
                        start_datetime,
                        end_datetime
                    ]
                )

        return queryset.order_by("-created_at", "-id")
    

class ExportTransactionsExcel(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def get(self, request):

        viewset = TransactionViewSet()
        viewset.request = request
        queryset = viewset.get_queryset()

        # -----------------------------------
        # CREATE EXCEL
        # -----------------------------------
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Transactions"

        # Headers
        ws.append([
            "ID",
            "Type",
            "Original TXN ID",
            "Customer Name",
            "Customer Mobile",
            "Pump Code",
            "Pump Name",
            "Pump Location",
            "Attendant Name",
            "Attendant Phone",
            "Manager Name",
            "Manager Phone",
            "Fuel Type",
            "Original Amount",
            "Final Amount",
            "Quantity",
            "Points Used",
            "Points Earned",
            "Remaining Points",
            "Created At",
        ])

        # Data (NO pagination)
        for txn in queryset.iterator():
            ws.append([
                txn.id,
                txn.transaction_type,
                txn.original_transaction.id if txn.original_transaction else None,
                txn.customer_name,
                txn.customer_mobile,
                txn.pump_code,
                txn.pump_name,
                txn.pump_location,
                txn.attendant_name,
                txn.attendant_phone,
                txn.manager_name,
                txn.manager_phone,
                txn.get_fuel_type_display(),
                float(txn.original_amount),
                float(txn.final_amount),
                float(txn.quantity),
                float(txn.points_used),
                float(txn.points_earned),
                float(txn.remaining_points),
                txn.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            ])

        # -----------------------------------
        # RESPONSE
        # -----------------------------------
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="transactions.xlsx"'

        wb.save(response)
        return response
    