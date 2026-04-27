from django.db import models
from pumps.models import Pump
from employees.models import Employee


class Transaction(models.Model):

    FUEL_TYPES = (
        ("petrol", "Petrol"),
        ("diesel", "Diesel"),
    )

    # -----------------------------------
    # RELATIONS (LIVE REFERENCES)
    # -----------------------------------

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    pump = models.ForeignKey(
        Pump,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    attendant = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    manager = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_transactions",
    )

    # -----------------------------------
    # SNAPSHOT / STABLE IDENTIFIERS
    # (Used for history, reports, audits)
    # -----------------------------------

    customer_name = models.CharField(
        max_length=200
    )

    customer_mobile = models.CharField(
        max_length=15,
        db_index=True
    )

    pump_code = models.CharField(
        max_length=30,
        db_index=True
    )

    pump_name = models.CharField(
        max_length=200
    )

    pump_location = models.CharField(
        max_length=300
    )

    attendant_name = models.CharField(
        max_length=200
    )

    attendant_phone = models.CharField(
        max_length=15,
        db_index=True
    )

    manager_name = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )

    manager_phone = models.CharField(
        max_length=15,
        null=True,
        blank=True,
        db_index=True
    )

    # -----------------------------------
    # FUEL
    # -----------------------------------

    fuel_type = models.CharField(
        max_length=10,
        choices=FUEL_TYPES
    )

    # -----------------------------------
    # AMOUNTS
    # -----------------------------------

    original_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    final_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=3
    )

    # -----------------------------------
    # LOYALTY POINTS
    # -----------------------------------

    points_used = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    points_earned = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    remaining_points = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    # -----------------------------------
    # TIMESTAMP
    # -----------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )

    # -----------------------------------
    # META
    # -----------------------------------

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["pump_code", "created_at"]
            ),
            models.Index(
                fields=["attendant_phone", "created_at"]
            ),
            models.Index(
                fields=["customer_mobile", "created_at"]
            ),
        ]

    # -----------------------------------
    # STRING REPRESENTATION
    # -----------------------------------

    def __str__(self):
        return (
            f"TXN#{self.id} | "
            f"{self.pump_code} | "
            f"{self.pump_name} | "
            f"{self.customer_name} | "
            f"₹{self.final_amount} | "
            f"{self.created_at:%d-%m-%Y %H:%M}"
        )
    