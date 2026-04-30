from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterUserView,
    LoginView,
    UpdateUserView,
    MyProfileView,
    OwnerListView,
    OwnerDetailView,
)

urlpatterns = [
    # -----------------------------
    # AUTHENTICATION
    # -----------------------------
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()), 

    # -----------------------------
    # USER MANAGEMENT
    # -----------------------------
    path('users/<int:id>/', UpdateUserView.as_view()), 
    path('me/', MyProfileView.as_view()),

    # -----------------------------
    # OWNER MANAGEMENT
    # -----------------------------
    path(
        "owners/",
        OwnerListView.as_view()
    ),

    path(
        "owners/<int:id>/",
        OwnerDetailView.as_view()
    ),
]
