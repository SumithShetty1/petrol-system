from django.urls import path
from .views import (
    OwnerDashboardView,
    OwnerPumpDetailDashboardView,
    PumpDashboardView,
    MyAttendantDashboardView,
    AttendantDashboardDetailView
)

urlpatterns = [
    path("owner/", OwnerDashboardView.as_view()),

    path("owner/pumps/<str:pump_code>/", OwnerPumpDetailDashboardView.as_view()),

    path("manager/pump/", PumpDashboardView.as_view()),
    
    path("manager/attendants/<str:phone>/", AttendantDashboardDetailView.as_view()),

    path("attendant/me/", MyAttendantDashboardView.as_view()),
]
