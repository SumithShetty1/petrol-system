from django.db import models
from accounts.models import User
from pumps.models import Pump

class Employee(models.Model):

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="employees"
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )

    pump = models.ForeignKey(
        Pump,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ["user__first_name"]


    def __str__(self):
        employee_name = (
            self.user.get_full_name().strip()
            or self.user.username
        )
    
        owner_name = (
            self.owner.get_full_name().strip()
            or self.owner.username
        )
    
        pump_name = (
            self.pump.pump_name
            if self.pump
            else "No Pump"
        )
    
        return (
            f"{employee_name} | "
            f"{self.user.username} | "
            f"{self.user.get_role_display()} | "
            f"Owner: {owner_name} | "
            f"Pump: {pump_name}"
        )
