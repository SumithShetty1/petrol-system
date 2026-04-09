from django.urls import path
from .views import RegisterUserView, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),  
]
