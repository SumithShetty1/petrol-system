from rest_framework import serializers
from .models import Employee


# -----------------------------------
# SHARED BASE SERIALIZER
# -----------------------------------
class EmployeeBaseSerializer(serializers.ModelSerializer):

    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    phone = serializers.CharField(
        source="user.username",
        read_only=True
    )

    role = serializers.CharField(
        source="user.role",
        read_only=True
    )

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True
    )

    owner_id = serializers.IntegerField(
        source="owner.id",
        read_only=True
    )

    owner_name = serializers.SerializerMethodField()

    manager_name = serializers.SerializerMethodField()

    pump_code = serializers.CharField(
        source="pump.pump_code",
        read_only=True
    )

    pump_name = serializers.CharField(
        source="pump.pump_name",
        read_only=True
    )

    location = serializers.CharField(
        source="pump.location",
        read_only=True
    )
    
    # -----------------------------------
    # OWNER
    # -----------------------------------
    def get_owner_name(self, obj):
        if obj.owner:
            return (
                obj.owner.get_full_name().strip()
                or obj.owner.username
            )
        return None

    # -----------------------------------
    # MANAGER
    # -----------------------------------
    def get_manager_name(self, obj):
        if (
            obj.pump and
            obj.pump.manager and
            obj.pump.manager.user
        ):
            manager_user = obj.pump.manager.user

            return (
                manager_user.get_full_name().strip()
                or manager_user.username
            )

        return None


# -----------------------------------
# LIST SERIALIZER
# attendants / managers / employee list
# -----------------------------------
class EmployeeListSerializer(EmployeeBaseSerializer):

    class Meta:
        model = Employee
        fields = [
            "id",
            "user_id",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "pump_code",
            "pump_name",
        ]


# -----------------------------------
# PROFILE SERIALIZER
# manager / attendant settings page
# -----------------------------------
class EmployeeProfileSerializer(EmployeeBaseSerializer):

    class Meta:
        model = Employee
        fields = [
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",

            "owner_name",
            "manager_name",
            
            "pump_code",
            "pump_name",
            "location",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        role = instance.user.role

        # Manager profile should not show manager_name (self)
        if role == "manager":
            data.pop("manager_name", None)

        # Attendant profile should show both
        # owner_name + manager_name

        return data

