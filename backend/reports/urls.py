from django.urls import path
from .views import (
    AdminDashboardView,
    AdminPumpDetailDashboardView,
    OwnerDashboardView,
    OwnerPumpDetailDashboardView,
    PumpDashboardView,
    MyAttendantDashboardView,
    AttendantDashboardDetailView
)

urlpatterns = [
    # -----------------------------------
    # ADMIN DASHBOARD
    # -----------------------------------
    path("admin/", AdminDashboardView.as_view()),

    path(
    "admin/pumps/<str:pump_code>/",
    AdminPumpDetailDashboardView.as_view()
    ),
    
    # -----------------------------------
    # OWNER DASHBOARD
    # -----------------------------------
    path("owner/", OwnerDashboardView.as_view()),

    path("owner/pumps/<str:pump_code>/", OwnerPumpDetailDashboardView.as_view()),

    # -----------------------------------
    # MANAGER DASHBOARD
    # -----------------------------------
    path("manager/pump/", PumpDashboardView.as_view()),
    
    path("manager/attendants/<str:phone>/", AttendantDashboardDetailView.as_view()),

    # -----------------------------------
    # ATTENDANT DASHBOARD
    # -----------------------------------
    path("attendant/me/", MyAttendantDashboardView.as_view()),
]
