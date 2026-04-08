from django.urls import path
from .views import AttendantProfileView

urlpatterns = [
    path("profile/", AttendantProfileView.as_view())
]
