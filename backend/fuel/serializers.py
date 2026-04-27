from rest_framework import serializers
from .models import FuelRate

class FuelRateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FuelRate
        fields = [
            "id",
            "pump",
            "fuel_type",
            "price_per_litre",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "pump",
            "created_at",
            "updated_at",
        ]
