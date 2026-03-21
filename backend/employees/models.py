from django.db import models
from accounts.models import User
from pumps.models import Pump

class Employee(models.Model):

    name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=15)

    pump = models.ForeignKey(Pump, on_delete=models.CASCADE, related_name='employees')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employee_profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    