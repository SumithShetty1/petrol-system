from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    EmployeeViewSet,
    EmployeeProfileView,
    AttendantListView,
    ManagerListView,
)

# -----------------------------------
# DRF ROUTER SETUP
# -----------------------------------
router = DefaultRouter()
router.register(r"", EmployeeViewSet)


# -----------------------------------
# URL PATTERNS
# -----------------------------------
urlpatterns = [
    # -----------------------------
    # PROFILE
    # -----------------------------
    path("profile/", EmployeeProfileView.as_view()),

    # -----------------------------
    # ROLE-SPECIFIC LISTS
    # -----------------------------
    path("attendants/", AttendantListView.as_view()),

    path("managers/", ManagerListView.as_view()),
    
    # -----------------------------
    # DEFAULT EMPLOYEE ROUTES
    # -----------------------------
    path("", include(router.urls)),
]
