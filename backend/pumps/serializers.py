from rest_framework import serializers
from .models import Pump

from django.db import transaction


# -----------------------------------
# SHARED READ SERIALIZER
# -----------------------------------
class PumpBaseReadSerializer(serializers.ModelSerializer):

    manager_name = serializers.SerializerMethodField()

    manager_phone = serializers.SerializerMethodField()

    owner_id = serializers.SerializerMethodField()

    owner_name = serializers.SerializerMethodField()
    
    owner_phone = serializers.SerializerMethodField()

    petrol_price = serializers.SerializerMethodField()

    diesel_price = serializers.SerializerMethodField()

    # -----------------------------
    # MANAGER
    # -----------------------------
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

    # -----------------------------
    # OWNER
    # -----------------------------
    def get_owner_id(self, obj):
        return obj.owner.id if obj.owner else None

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

    # -----------------------------
    # FUEL PRICES
    # -----------------------------
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

            "owner_id",
            "owner_name",
            "manager_name",

            "petrol_price",
            "diesel_price",
        ]


# -----------------------------------
# DETAIL PAGE
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

    # -----------------------------
    # VALIDATION
    # -----------------------------
    def validate(self, attrs):
        owner = attrs.get("owner", getattr(self.instance, "owner", None))
        manager = attrs.get("manager")

        if manager and manager.owner != owner:
            raise serializers.ValidationError(
                "Manager must belong to the same owner"
            )

        return attrs


    def validate_pump_code(
        self,
        value
    ):
        return value.upper().strip()

    # -----------------------------
    # UPDATE LOGIC
    # -----------------------------
    @transaction.atomic
    def update(self, instance, validated_data):
        new_manager = validated_data.get("manager", None)
        old_manager = instance.manager

        # -----------------------------------
        # HANDLE MANAGER REASSIGNMENT
        # -----------------------------------
        if "manager" in validated_data:

            # Case 1: removing manager
            if new_manager is None:
                if old_manager:
                    old_manager.pump = None
                    old_manager.save(update_fields=["pump"])

                instance.manager = None
                instance.save(update_fields=["manager"])

            else:
                # Case 2: assigning new manager

                # If new manager already manages another pump → remove from there
                previous_pump = Pump.objects.filter(
                    manager=new_manager
                ).exclude(id=instance.id).first()

                if previous_pump:
                    previous_pump.manager = None
                    previous_pump.save(update_fields=["manager"])

                # Clear old manager
                if old_manager and old_manager != new_manager:
                    old_manager.pump = None
                    old_manager.save(update_fields=["pump"])

                # Assign new manager
                instance.manager = new_manager
                instance.save(update_fields=["manager"])

                # Sync employee side
                if new_manager.pump != instance:
                    new_manager.pump = instance
                    new_manager.save(update_fields=["pump"])

        
        validated_data.pop("pump_code", None)
        validated_data.pop("manager", None)

        return super().update(instance, validated_data)
