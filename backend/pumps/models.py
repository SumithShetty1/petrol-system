from django.db import models
from accounts.models import User


class Pump(models.Model):

    pump_name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)

    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_pumps"
    )

    manager = models.ForeignKey(
        'employees.Employee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_pumps"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        owner = self.owner.get_full_name() if self.owner else "No Owner"
        return f"{self.pump_name} | {self.location} | {owner}"
