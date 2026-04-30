from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CreateTransactionView, ExportTransactionsExcel, TransactionViewSet

# -----------------------------------
# DRF ROUTER
# -----------------------------------
router = DefaultRouter()
router.register("", TransactionViewSet, basename="transactions")

# -----------------------------------
# CUSTOM ENDPOINTS
# -----------------------------------
urlpatterns = [
    path("create/", CreateTransactionView.as_view()),
    path("export/", ExportTransactionsExcel.as_view()),
]

# -----------------------------------
# ROUTER URLS
# -----------------------------------
urlpatterns += router.urls
