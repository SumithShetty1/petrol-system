from django.db import models
from decimal import Decimal

class Customer(models.Model):

    name = models.CharField(max_length=200)
    mobile_number = models.CharField(max_length=15, unique=True)
    total_points = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.mobile_number}"
    
    
class PointsHistory(models.Model):

    TYPE_CHOICES = (
        ('earn', 'Earn'),
        ('redeem', 'Redeem'),
        ('adjustment', 'Adjustment'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='points_history'
    )

    transaction = models.ForeignKey(
        'transactions.Transaction',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    points_change = models.DecimalField(max_digits=10, decimal_places=2)

    balance_after = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

