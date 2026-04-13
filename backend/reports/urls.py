from django.urls import path
from .views import DashboardView, AttendantDashboardView

urlpatterns = [
    path("dashboard/", DashboardView.as_view()),
    path("attendant-dashboard/", AttendantDashboardView.as_view()),
]
