from django.urls import path
from .views import DashboardView

urlpatterns = [
    path("dashboard/<int:pump_id>/", DashboardView.as_view()),
]
