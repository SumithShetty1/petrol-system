from django.db import models
from accounts.models import User
from pumps.models import Pump

class Employee(models.Model):

    pump = models.ForeignKey(
        Pump,
        on_delete=models.CASCADE,
        related_name='employees'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='employee_profile'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        name = self.user.get_full_name().strip() or self.user.username
        return f"{name} | {self.user.username} | {self.user.get_role_display()} | {self.pump.pump_name}"    
