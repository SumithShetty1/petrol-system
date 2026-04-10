from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CreateTransactionView, TransactionViewSet

router = DefaultRouter()
router.register("", TransactionViewSet, basename="transactions")

urlpatterns = [
    path("create/", CreateTransactionView.as_view()),
]

urlpatterns += router.urls
