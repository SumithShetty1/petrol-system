from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="user.get_full_name", read_only=True)
    phone = serializers.CharField(source="user.username", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    pump_name = serializers.CharField(source="pump.pump_name", read_only=True)
    pump_location = serializers.CharField(source="pump.location", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "name",
            "phone",
            "role",
            "pump_name",
            "pump_location",
            "created_at"
        ]

 