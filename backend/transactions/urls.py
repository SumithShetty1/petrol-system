from django.urls import path
from .views import CreateTransactionView

urlpatterns = [
    path("create/", CreateTransactionView.as_view()),
]
