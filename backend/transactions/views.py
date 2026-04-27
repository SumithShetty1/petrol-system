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

from accounts.permissions import (
    IsAdminOwnerManager,
    IsAttendant
)

from employees.models import Employee

from .models import Transaction
from .serializers import (
    TransactionCreateSerializer,
    TransactionListSerializer
)
from .services import (
    process_transaction
)


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

        transaction = process_transaction(
            request.data,
            employee
        )

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
                pump__owner=user
            )

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
                    pump_code=employee.pump.pump_code
                )

            else:
                return (
                    Transaction.objects.none()
                )

        elif user.role == "attendant":

            queryset = queryset.filter(
                attendant_phone=user.username
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
                pump_code=pump_code
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
        today = (
            timezone
            .localtime()
            .date()
        )

        if range_type == "all":
            pass
        
        elif range_type == "today":
            queryset = queryset.filter(
                created_at__date=today
            )

        elif range_type == "week":

            start = (
                today -
                timedelta(days=7)
            )

            queryset = queryset.filter(
                created_at__date__gte=start
            )

        elif range_type == "month":

            start = (
                today -
                timedelta(days=30)
            )

            queryset = queryset.filter(
                created_at__date__gte=start
            )

        elif range_type == "year":

            start = (
                today -
                timedelta(days=365)
            )

            queryset = queryset.filter(
                created_at__date__gte=start
            )

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

        return queryset.order_by(
            "-created_at"
        )
    