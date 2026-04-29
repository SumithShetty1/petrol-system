from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Customer(models.Model):

    name = models.CharField(max_length=200)
    mobile_number = models.CharField(max_length=15, unique=True, db_index=True)
    total_points = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        name = (self.name or "").strip() or "Customer"
        return f"{name} | {self.mobile_number}"
    
    
class PointsHistory(models.Model):

    TYPE_CHOICES = (
        ('earn', 'Earn'),
        ('redeem', 'Redeem'),
        ('adjustment', 'Adjustment'),
        ('reversal', 'Reversal'),
    )

    # -------------------------
    # RELATION
    # -------------------------
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='points_history'
    )

    transaction = models.ForeignKey(
        'transactions.Transaction',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="points_history"
    )

    # -------------------------
    # REVERSAL LINK
    # -------------------------
    reversed_from = models.OneToOneField(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reversal"
    )

    # -------------------------
    # SNAPSHOT DATA
    # -------------------------
    customer_name = models.CharField(max_length=200)
    customer_mobile = models.CharField(max_length=15, db_index=True)

    # -------------------------
    # POINTS
    # -------------------------
    points_change = models.DecimalField(max_digits=12, decimal_places=2)

    balance_after = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES, db_index=True)

    # -------------------------
    # AUDIT FIELDS
    # -------------------------
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    adjustment_reason = models.TextField(
        null=True,
        blank=True
    )

    # -------------------------
    # TIMESTAMP
    # -------------------------
    created_at = models.DateTimeField(auto_now_add=True)

    # -------------------------
    # META
    # -------------------------
    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["customer_mobile", "created_at"]),
            models.Index(fields=["type", "created_at"]),
            models.Index(fields=["transaction", "created_at"])
        ]

    def __str__(self):
        return f"{self.customer_name} | {self.get_type_display()} | {self.points_change} | {self.created_at:%Y-%m-%d}"
    