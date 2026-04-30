from rest_framework import serializers
from .models import FuelRate

class FuelRateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FuelRate

        # -----------------------------
        # FIELDS INCLUDED IN API
        # -----------------------------
        fields = [
            "id",
            "pump",
            "fuel_type",
            "price_per_litre",
            "created_at",
            "updated_at",
        ]

        # -----------------------------
        # READ-ONLY FIELDS
        # -----------------------------
        read_only_fields = [
            "pump",
            "created_at",
            "updated_at",
        ]
