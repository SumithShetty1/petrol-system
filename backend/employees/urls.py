from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, EmployeeProfileView, AttendantListView

router = DefaultRouter()
router.register(r'', EmployeeViewSet)

urlpatterns = [
    path('profile/', EmployeeProfileView.as_view()),

    path('attendants/', AttendantListView.as_view()),

    path('', include(router.urls)),
]
