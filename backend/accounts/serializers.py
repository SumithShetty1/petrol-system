from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)

from django.db import transaction

from .models import User

from employees.models import Employee
from pumps.models import Pump


# -----------------------------------
# USER SERIALIZER
# -----------------------------------
class UserSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "first_name",
            "last_name",
            "is_active",
        ]

        read_only_fields = [
            "id",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    # -----------------------------------
    # PHONE VALIDATION
    # username = phone number
    # -----------------------------------
    def validate_username(
        self,
        value
    ):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone must contain only digits"
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone must be 10 digits"
            )

        instance = self.instance

        if instance:
            exists = (
                User.objects
                .filter(username=value)
                .exclude(id=instance.id)
                .exists()
            )
        else:
            exists = (
                User.objects
                .filter(username=value)
                .exists()
            )

        if exists:
            raise serializers.ValidationError(
                "Phone already exists"
            )

        return value

    # -----------------------------------
    # CREATE USER
    # admin   -> owner
    # owner   -> manager
    # manager -> attendant
    # -----------------------------------
    def create(
        self,
        validated_data
    ):
        request = self.context["request"]

        creator = request.user

        password = validated_data.pop(
            "password"
        )

        target_role = validated_data.get(
            "role"
        )

        # -------------------------
        # ROLE HIERARCHY
        # -------------------------
        if creator.role == "admin":
            allowed_roles = [
                "owner"
            ]

        elif creator.role == "owner":
            allowed_roles = [
                "manager"
            ]

        elif creator.role == "manager":
            allowed_roles = [
                "attendant"
            ]

        else:
            raise PermissionDenied(
                "You cannot create users"
            )

        if target_role not in allowed_roles:
            raise PermissionDenied(
                f"You cannot create {target_role}"
            )

        # -------------------------
        # CREATE USER
        # -------------------------
        user = User(**validated_data)

        user.set_password(password)

        user.save()

        # -------------------------
        # CREATE EMPLOYEE RECORD
        # For manager / attendant
        # -------------------------
        if target_role in [
            "manager",
            "attendant"
        ]:

            # ---------------------
            # Owner creates manager
            # ---------------------
            if creator.role == "owner":

                pump_id = request.data.get(
                    "pump_id"
                )

                if not pump_id:
                    raise PermissionDenied(
                        "Pump ID is required"
                    )

                try:
                    pump = Pump.objects.select_related("manager").get(
                        id=pump_id,
                        owner=creator
                    )

                except Pump.DoesNotExist:
                    raise PermissionDenied(
                        "Invalid pump"
                    )

                owner_user = creator

            # ---------------------
            # Manager creates attendant
            # ---------------------
            elif creator.role == "manager":

                creator_emp = (
                    Employee.objects
                    .select_related(
                        "pump",
                        "owner"
                    )
                    .filter(
                        user=creator
                    )
                    .first()
                )

                if (
                    not creator_emp or
                    not creator_emp.pump
                ):
                    raise PermissionDenied(
                        "Manager has no pump assigned"
                    )

                pump = creator_emp.pump

                owner_user = creator_emp.owner

            else:
                raise PermissionDenied(
                    "Invalid creator"
                )

            if target_role == "manager" and pump.manager:
                raise PermissionDenied("Pump already has manager")

            employee = Employee.objects.create(
                owner=owner_user,
                user=user,
                pump=pump
            )

            if target_role == "manager":
                pump.manager = employee
                pump.save(update_fields=["manager"])

        return user

    # -----------------------------------
    # UPDATE USER
    # -----------------------------------
    @transaction.atomic
    def update(self, instance, validated_data):
        request = self.context["request"]
        updater = request.user

        password = validated_data.pop("password", None)
        pump_id = request.data.get("pump_id")

        if "role" in validated_data:
            raise PermissionDenied("Role cannot be updated")

        if "username" in validated_data:
            raise PermissionDenied("Phone cannot be updated")


        # -------------------------
        # OWNER permissions
        # -------------------------
        if updater.role == "owner":
            target_emp = Employee.objects.select_related(
                "owner", "pump"
            ).filter(user=instance).first()

            if (
                not target_emp or
                target_emp.owner != updater
            ):
                raise PermissionDenied(
                    "You cannot edit this user"
                )

            # Manager pump reassignment
            if (
                instance.role == "manager"
                and pump_id
            ):
                new_pump = Pump.objects.select_related(
                    "manager"
                ).filter(
                    id=pump_id,
                    owner=updater
                ).first()

                if not new_pump:
                    raise PermissionDenied(
                        "Invalid pump"
                    )

                # if another manager exists
                if (
                    new_pump.manager and
                    new_pump.manager.user != instance
                ):
                    raise PermissionDenied(
                        "Pump already has manager"
                    )

                # clear old pump manager
                old_pump = target_emp.pump

                if old_pump and old_pump.manager == target_emp:
                    old_pump.manager = None
                    old_pump.save(update_fields=["manager"])

                # assign new
                target_emp.pump = new_pump
                target_emp.save(update_fields=["pump"])

                new_pump.manager = target_emp
                new_pump.save(update_fields=["manager"])

        # -------------------------
        # MANAGER permissions
        # -------------------------
        elif updater.role == "manager":
            updater_emp = Employee.objects.select_related(
                "pump"
            ).filter(user=updater).first()

            target_emp = Employee.objects.select_related(
                "pump"
            ).filter(user=instance).first()

            if (
                not updater_emp or
                not target_emp or
                updater_emp.pump != target_emp.pump or
                instance.role != "attendant"
            ):
                raise PermissionDenied(
                    "You cannot edit this user"
                )

        # -------------------------
        # apply user fields
        # -------------------------
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance


# -----------------------------------
# JWT TOKEN SERIALIZER
# -----------------------------------
class CustomTokenSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(
        cls,
        user
    ):
        token = super().get_token(
            user
        )

        token["role"] = user.role
        token["username"] = user.username
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token
    