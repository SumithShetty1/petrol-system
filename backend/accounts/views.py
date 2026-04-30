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
    IsAdminOwnerManager, IsAdmin
)

from employees.models import Employee


# -----------------------------------
# REGISTER USER
# -----------------------------------
class RegisterUserView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save()

    def get_serializer_context(self):
        return {"request": self.request}


# -----------------------------------
# LOGIN (JWT)
# -----------------------------------
class LoginView(TokenObtainPairView):

    serializer_class = CustomTokenSerializer
    permission_classes = [AllowAny]


# -----------------------------------
# UPDATE / DELETE USER
# -----------------------------------
class UpdateUserView(generics.RetrieveUpdateDestroyAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdminOwnerManager
    ]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_object(self):
        return get_object_or_404(
            User,
            id=self.kwargs.get("id")
        )

    # -----------------------------------
    # PATCH
    # -----------------------------------
    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    # -----------------------------------
    # DELETE
    # -----------------------------------
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):

        target_user = self.get_object()
        requester = request.user

        # -------------------------
        # BASIC SAFETY
        # -------------------------
        if target_user == requester:
            raise PermissionDenied("You cannot delete yourself")

        if target_user.role == "admin":
            raise PermissionDenied("Admin users cannot be deleted")

        # -------------------------
        # GET EMPLOYEE
        # -------------------------
        target_emp = (
            Employee.objects
            .select_related("owner", "pump")
            .filter(user=target_user)
            .first()
        )

        # -------------------------
        # ADMIN RULE
        # -------------------------
        if requester.role == "admin":
            pass  # full access

        # -------------------------
        # OWNER RULE
        # -------------------------
        if requester.role == "owner":

            if not target_emp or target_emp.owner != requester:
                raise PermissionDenied("You cannot delete this user")

        # -------------------------
        # MANAGER RULE
        # -------------------------
        elif requester.role == "manager":

            requester_emp = (
                Employee.objects
                .select_related("pump")
                .filter(user=requester)
                .first()
            )

            if (
                not requester_emp or
                not requester_emp.pump or
                not target_emp or
                target_user.role != "attendant" or
                target_emp.pump != requester_emp.pump
            ):
                raise PermissionDenied("You cannot delete this user")

        # -------------------------
        # CLEANUP
        # -------------------------
        if target_emp:

            # If deleting manager → unlink from pump
            if target_user.role == "manager":
                pump = target_emp.pump
                if pump and pump.manager == target_emp:
                    pump.manager = None
                    pump.save(update_fields=["manager"])

            target_emp.delete()

        # -------------------------
        # DELETE USER
        # -------------------------
        target_user.delete()

        return Response({
            "message": "User deleted successfully"
        })


# -----------------------------------
# MY PROFILE
# -----------------------------------
class MyProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.username,
            "role": user.role,
            "is_active": user.is_active,
        })


# -----------------------------------
# OWNERS LIST (ADMIN ONLY)
# -----------------------------------
class OwnerListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return User.objects.filter(
            role="owner"
        ).order_by("first_name", "last_name")


# -----------------------------------
# OWNER DETAIL (ADMIN ONLY)
# -----------------------------------
class OwnerDetailView(generics.RetrieveAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_url_kwarg = "id"

    def get_queryset(self):

        return User.objects.filter(role="owner")
    