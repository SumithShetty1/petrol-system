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
from employees.views import EmployeeViewSet
from customers.views import CustomerViewSet
from fuel.views import FuelRateViewSet


router = DefaultRouter()

router.register(r'pumps', PumpViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'fuel-rates', FuelRateViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path("api/employees/", include("employees.urls")),
    path('api/', include(router.urls)),
    path("api/transactions/", include("transactions.urls")),
    path("api/reports/", include("reports.urls")),
]
