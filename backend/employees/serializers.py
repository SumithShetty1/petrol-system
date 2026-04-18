from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    user_id = serializers.IntegerField(source="user.id", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    phone = serializers.CharField(source="user.username", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    status = serializers.BooleanField(source="user.status", read_only=True)
    pump_name = serializers.CharField(source="pump.pump_name", read_only=True)
    location = serializers.CharField(source="pump.location", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "user_id",
            "first_name",
            "last_name",
            "phone",
            "role",
            "status",
            "pump_name",
            "location",
            "created_at"
        ]

 