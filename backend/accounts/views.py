from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .permissions import IsAdminOwnerManager
from rest_framework import generics
from .models import User
from .serializers import UserSerializer, CustomTokenSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from employees.models import Employee
from rest_framework.views import APIView


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_serializer_context(self):
        return {"request": self.request}


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
    permission_classes = [AllowAny]


class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOwnerManager]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_object(self):
        user_id = self.kwargs.get("id")
        return get_object_or_404(User, id=user_id)
    
    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        requester = request.user

        # Prevent self delete
        if user == requester:
            raise PermissionDenied("You cannot delete yourself")

        # Role restriction
        if requester.role == "manager":
            requester_emp = Employee.objects.filter(user=requester).first()
            target_emp = Employee.objects.filter(user=user).first()

            if not requester_emp or not target_emp or requester_emp.pump != target_emp.pump:
                raise PermissionDenied("You cannot delete this user")

        user.delete()
        
        return Response({"message": "User deleted successfully"})
    

class MyProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.username,
            "role": user.role,
        })
    