from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('attendant', 'Attendant'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="admin")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        name = self.get_full_name().strip() or "Unnamed User"
        return f"{name} | {self.username} | {self.get_role_display()}"
