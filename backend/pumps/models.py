from django.db import models
from accounts.models import User


class Pump(models.Model):

    # -----------------------------------
    # PERMANENT BUSINESS IDENTITY
    # -----------------------------------
    pump_code = models.CharField(
        max_length=30,
        unique=True,
        db_index=True
    )

    # -----------------------------------
    # BASIC INFO
    # -----------------------------------
    pump_name = models.CharField(
        max_length=200
    )

    location = models.CharField(
        max_length=300
    )

    # -----------------------------------
    # RELATIONS
    # -----------------------------------
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_pumps"
    )

    manager = models.ForeignKey(
        "employees.Employee",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_pumps"
    )

    # -----------------------------------
    # STATUS
    # -----------------------------------
    is_active = models.BooleanField(
        default=True
    )

    # -----------------------------------
    # TIMESTAMPS
    # -----------------------------------
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # -----------------------------------
    # DEFAULT ORDERING
    # -----------------------------------
    class Meta:
        ordering = ["pump_code"]

    # -----------------------------------
    # STRING DISPLAY
    # -----------------------------------
    def __str__(self):
        owner_name = (
            self.owner.get_full_name().strip()
            if self.owner
            else "No Owner"
        )

        status = (
            "Active"
            if self.is_active
            else "Inactive"
        )

        return (
            f"{self.pump_code} | "
            f"{self.pump_name} | "
            f"{self.location} | "
            f"{owner_name} | "
            f"{status}"
        )
    