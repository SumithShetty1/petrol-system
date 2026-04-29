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
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()), 
    path('users/<int:id>/', UpdateUserView.as_view()), 
    path('me/', MyProfileView.as_view()),
    path(
        "owners/",
        OwnerListView.as_view()
    ),

    path(
        "owners/<int:id>/",
        OwnerDetailView.as_view()
    ),
]
