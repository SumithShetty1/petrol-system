from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from rest_framework.exceptions import (
    PermissionDenied
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

from .models import User
from .serializers import (
    UserSerializer,
    CustomTokenSerializer
)

from .permissions import (
    IsAdminOwnerManager
)

from employees.models import Employee


# -----------------------------------
# REGISTER USER
# Admin   -> Owner
# Owner   -> Manager
# Manager -> Attendant
# -----------------------------------
class RegisterUserView(
    generics.CreateAPIView
):

    queryset = User.objects.all()

    serializer_class = (
        UserSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    @transaction.atomic
    def perform_create(
        self,
        serializer
    ):
        serializer.save()

    def get_serializer_context(
        self
    ):
        return {
            "request":
            self.request
        }


# -----------------------------------
# LOGIN
# -----------------------------------
class LoginView(
    TokenObtainPairView
):

    serializer_class = (
        CustomTokenSerializer
    )

    permission_classes = [
        AllowAny
    ]


# -----------------------------------
# UPDATE / DELETE USER
# -----------------------------------
class UpdateUserView(
    generics.UpdateAPIView
):

    queryset = User.objects.all()

    serializer_class = (
        UserSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    def get_serializer_context(
        self
    ):
        return {
            "request":
            self.request
        }

    def get_object(
        self
    ):
        user_id = self.kwargs.get(
            "id"
        )

        return get_object_or_404(
            User,
            id=user_id
        )

    # -----------------------------------
    # PATCH
    # -----------------------------------
    def patch(
        self,
        request,
        *args,
        **kwargs
    ):
        kwargs["partial"] = True

        return self.update(
            request,
            *args,
            **kwargs
        )

    # -----------------------------------
    # DELETE
    # -----------------------------------
    @transaction.atomic
    def delete(
        self,
        request,
        *args,
        **kwargs
    ):
        target_user = self.get_object()

        requester = request.user

        # -------------------------
        # Prevent self delete
        # -------------------------
        if target_user == requester:
            raise PermissionDenied(
                "You cannot delete yourself"
            )

        # -------------------------
        # Prevent deleting admin
        # -------------------------
        if target_user.role == "admin":
            raise PermissionDenied(
                "Admin users cannot be deleted"
            )

        # -------------------------
        # OWNER restriction
        # Can delete only own staff
        # -------------------------
        if requester.role == "owner":

            target_emp = (
                Employee.objects
                .select_related(
                    "owner"
                )
                .filter(
                    user=target_user
                )
                .first()
            )

            if (
                not target_emp or
                target_emp.owner != requester
            ):
                raise PermissionDenied(
                    "You cannot delete this user"
                )

        # -------------------------
        # MANAGER restriction
        # Can delete only attendants
        # from same pump
        # -------------------------
        elif requester.role == "manager":

            requester_emp = (
                Employee.objects
                .select_related(
                    "pump"
                )
                .filter(
                    user=requester
                )
                .first()
            )

            target_emp = (
                Employee.objects
                .select_related(
                    "pump"
                )
                .filter(
                    user=target_user
                )
                .first()
            )

            if (
                not requester_emp or
                not requester_emp.pump
            ):
                raise PermissionDenied(
                    "Manager has no pump assigned"
                )

            if (
                not target_emp or
                target_user.role != "attendant" or
                target_emp.pump != requester_emp.pump
            ):
                raise PermissionDenied(
                    "You cannot delete this user"
                )

        # -------------------------
        # Delete user
        # -------------------------
        target_user.delete()

        return Response(
            {
                "message":
                "User deleted successfully"
            }
        )


# -----------------------------------
# MY PROFILE
# -----------------------------------
class MyProfileView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):
        user = request.user

        return Response(
            {
                "id":
                user.id,

                "first_name":
                user.first_name,

                "last_name":
                user.last_name,

                "phone":
                user.username,

                "role":
                user.role,

                "is_active":
                user.is_active,
            }
        )
        