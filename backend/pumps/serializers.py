from rest_framework import serializers
from .models import Pump


# -----------------------------------
# SHARED READ SERIALIZER
# -----------------------------------
class PumpBaseReadSerializer(serializers.ModelSerializer):

    manager_name = serializers.SerializerMethodField()

    manager_phone = serializers.SerializerMethodField()

    owner_name = serializers.SerializerMethodField()
    
    owner_phone = serializers.SerializerMethodField()

    petrol_price = serializers.SerializerMethodField()

    diesel_price = serializers.SerializerMethodField()

    def get_manager_name(self, obj):
        if obj.manager and obj.manager.user:
            return (
                obj.manager.user.get_full_name().strip()
                or obj.manager.user.username
            )
        return None

    def get_manager_phone(self, obj):
        if obj.manager and obj.manager.user:
            return obj.manager.user.username
        return None

    def get_owner_name(self, obj):
        if obj.owner:
            return (
                obj.owner.get_full_name().strip()
                or obj.owner.username
            )
        return None

    def get_owner_phone(self, obj):
        if obj.owner:
            return obj.owner.username
        return None

    def get_petrol_price(self, obj):
        fuel = obj.fuel_rates.filter(
            fuel_type="petrol"
        ).first()

        return (
            fuel.price_per_litre
            if fuel else 0
        )

    def get_diesel_price(self, obj):
        fuel = obj.fuel_rates.filter(
            fuel_type="diesel"
        ).first()

        return (
            fuel.price_per_litre
            if fuel else 0
        )


# -----------------------------------
# LIST PAGE
# GET /pumps/
# -----------------------------------
class PumpListSerializer(
    PumpBaseReadSerializer
):

    class Meta:
        model = Pump
        fields = [
            "id",
            "pump_code",

            "pump_name",
            "location",

            "is_active",

            "manager_name",
            "manager_phone",

            "petrol_price",
            "diesel_price",
        ]


# -----------------------------------
# DETAIL PAGE
# GET /pumps/<pump_code>/
# -----------------------------------
class PumpDetailSerializer(
    PumpBaseReadSerializer
):

    class Meta:
        model = Pump
        fields = [
            "id",
            "pump_code",
            "pump_name",
            "location",
        
            "owner_name",
            "owner_phone",
        
            "manager_name",
            "manager_phone",
        
            "is_active",
            "petrol_price",
            "diesel_price",
        
            "created_at",
            "updated_at",
        ]


# -----------------------------------
# DASHBOARD HEADER
# GET /pumps/assigned/
# -----------------------------------
class PumpMiniSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Pump
        fields = [
            "id",
            "pump_code",
            "pump_name",
            "location",
        ]


# -----------------------------------
# CREATE / UPDATE
# POST / PATCH / PUT
# -----------------------------------
class PumpWriteSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Pump
        fields = [
            "pump_code",

            "pump_name",
            "location",

            "owner",
            "manager",

            "is_active",
        ]

    # -----------------------------------
    # NORMALIZE CODE
    # -----------------------------------
    def validate_pump_code(
        self,
        value
    ):
        return value.upper().strip()

    # -----------------------------------
    # PREVENT CODE CHANGE AFTER CREATE
    # -----------------------------------
    def update(
        self,
        instance,
        validated_data
    ):
        validated_data.pop(
            "pump_code",
            None
        )

        return super().update(
            instance,
            validated_data
        )
    
