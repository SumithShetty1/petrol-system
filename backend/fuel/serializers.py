from rest_framework import serializers
from .models import FuelRate

class FuelRateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FuelRate
        fields = "__all__"
        