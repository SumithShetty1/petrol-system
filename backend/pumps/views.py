from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminOwnerManager

from .models import Pump
from .serializers import (
    PumpListSerializer,
    PumpDetailSerializer,
    PumpMiniSerializer,
    PumpWriteSerializer,
)


class PumpViewSet(viewsets.ModelViewSet):

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    # -----------------------------------
    # USE pump_code IN URL
    # /pumps/PUMP-001/
    # -----------------------------------
    lookup_field = "pump_code"
    lookup_url_kwarg = "pump_code"

    queryset = Pump.objects.all()

    # -----------------------------------
    # QUERYSET
    # -----------------------------------
    def get_queryset(self):
        user = self.request.user

        base_queryset = Pump.objects.select_related(
            "owner",
            "manager__user"
        ).prefetch_related(
            "fuel_rates"
        )

        # Admin -> all pumps
        if user.role == "admin":
            return base_queryset

        # Owner -> own pumps
        if user.role == "owner":
            return base_queryset.filter(
                owner=user
            )

        # Manager -> assigned pump only
        if user.role == "manager":
            employee = user.employee_profile

            if employee and employee.pump:
                return base_queryset.filter(
                    pump_code=employee.pump.pump_code
                )

        return Pump.objects.none()

    # -----------------------------------
    # SERIALIZER SWITCHING
    # -----------------------------------
    def get_serializer_class(self):

        # GET /pumps/
        if self.action == "list":
            return PumpListSerializer

        # GET /pumps/<pump_code>/
        if self.action == "retrieve":
            return PumpDetailSerializer

        # GET /pumps/assigned/
        if self.action == "assigned":
            return PumpMiniSerializer

        # POST / PUT / PATCH
        if self.action in [
            "create",
            "update",
            "partial_update"
        ]:
            return PumpWriteSerializer

        return PumpDetailSerializer

    # -----------------------------------
    # MANAGER ASSIGNED PUMP
    # GET /pumps/assigned/
    # -----------------------------------
    @action(
        detail=False,
        methods=["get"],
        url_path="assigned"
    )
    def assigned(self, request):
        user = request.user

        employee = user.employee_profile

        if not employee or not employee.pump:
            return Response(
                {"error": "Pump not assigned"},
                status=404
            )

        serializer = PumpMiniSerializer(
            employee.pump
        )

        return Response(
            serializer.data
        )
    
    @action(detail=False, methods=["get"], url_path="available")
    def available(self, request):
        user = request.user

        queryset = Pump.objects.filter(
            owner=user,
            manager__isnull=True,
            is_active=True
        ).order_by("pump_code")

        serializer = PumpMiniSerializer(queryset, many=True)
        return Response(serializer.data)
    
    