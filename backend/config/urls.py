"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from pumps.views import PumpViewSet
from customers.views import CustomerViewSet
from fuel.views import FuelRateViewSet


# -----------------------------
# DRF ROUTER SETUP
# -----------------------------
router = DefaultRouter()

router.register(r'pumps', PumpViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'fuel-rates', FuelRateViewSet)


# -----------------------------
# MAIN URLPATTERNS
# -----------------------------
urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),

    # Authentication
    path('api/auth/', include('accounts.urls')),

    # Employee-related APIs
    path("api/employees/", include("employees.urls")),

    # Core resources handled by DRF router
    path('api/', include(router.urls)),

    # Transaction APIs
    path("api/transactions/", include("transactions.urls")),

    # Reports / analytics APIs
    path("api/reports/", include("reports.urls")),
]
