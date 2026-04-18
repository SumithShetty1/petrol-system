from django.urls import path
from .views import (
    PumpDashboardView,
    MyAttendantDashboardView,
    AttendantDashboardDetailView
)

urlpatterns = [
    path("pump/", PumpDashboardView.as_view()),

    # Logged-in attendant
    path("attendant/me/", MyAttendantDashboardView.as_view()),

    # Manager viewing specific attendant
    path("attendant/<int:attendant_id>/", AttendantDashboardDetailView.as_view()),
]
