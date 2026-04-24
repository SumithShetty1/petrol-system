from django.urls import path
from .views import MyProfileView, RegisterUserView, LoginView, UpdateUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()), 
    path('users/<int:id>/', UpdateUserView.as_view()), 
    path('me/', MyProfileView.as_view()),
]
