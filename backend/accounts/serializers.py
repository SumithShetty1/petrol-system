from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from .models import User
from employees.models import Employee
from pumps.models import Pump
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'status']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True}}

    # -------------------------
    # USERNAME VALIDATION
    # -------------------------
    def validate_username(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError("Phone must contain only digits")

        if len(value) != 10:
            raise serializers.ValidationError("Phone must be 10 digits")
    
        user = self.instance

        if user:
            # UPDATE CASE
            if User.objects.filter(username=value).exclude(id=user.id).exists():
                raise serializers.ValidationError("Phone already exists")
        else:
            # CREATE CASE
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Phone already exists")

        return value
    
    # -------------------------
    # CREATE
    # -------------------------
    def create(self, validated_data):
        request = self.context["request"]
        creator = request.user

        password = validated_data.pop('password')
        role = validated_data.get("role")

        # -------------------------
        # ROLE HIERARCHY
        # -------------------------
        if creator.role == "admin":
            allowed_roles = ["owner"]
        elif creator.role == "owner":
            allowed_roles = ["manager"]
        elif creator.role == "manager":
            allowed_roles = ["attendant"]
        else:
            raise PermissionDenied("You cannot create users")

        if role not in allowed_roles:
            raise PermissionDenied(f"You cannot create {role}")

        # -------------------------
        # CREATE USER
        # -------------------------
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # -------------------------
        # CREATE EMPLOYEE (if needed)
        # -------------------------
        if role in ["manager", "attendant"]:
            
            # Manager → auto assign THEIR pump
            if creator.role == "manager":
                emp = Employee.objects.filter(user=creator).first()

                if not emp:
                    raise PermissionDenied("Manager has no pump assigned")

                pump = emp.pump

            # Owner → must choose pump
            elif creator.role == "owner":
                pump_id = request.data.get("pump_id")

                if not pump_id:
                    raise PermissionDenied("Pump ID is required")

                try:
                    pump = Pump.objects.get(id=pump_id, owner=creator)
                except Pump.DoesNotExist:
                    raise PermissionDenied("Invalid pump")

            else:
                raise PermissionDenied("Invalid role for pump assignment")

            Employee.objects.create(user=user, pump=pump)

        return user
    
    # -------------------------
    # UPDATE
    # -------------------------
    def update(self, instance, validated_data):
        request = self.context["request"]
        updater = request.user

        password = validated_data.pop("password", None)

        # Prevent role changes
        if "role" in validated_data:
            raise PermissionDenied("Role cannot be updated")

        # Restrict who can edit whom
        if updater.role == "manager":
            emp = Employee.objects.filter(user=updater).first()

            target_emp = Employee.objects.filter(user=instance).first()

            if not emp or not target_emp or emp.pump != target_emp.pump:
                raise PermissionDenied("You cannot edit this user")

        # UPDATE FIELDS
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # PASSWORD UPDATE
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class CustomTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role
        token['username'] = user.username

        return token

