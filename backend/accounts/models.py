from django.db import models
from django.contrib.auth.models import AbstractUser


# Custom User model extending Django's AbstractUser
class User(AbstractUser):

    # -----------------------------
    # ROLE MANAGEMENT
    # -----------------------------
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('attendant', 'Attendant'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="admin")
    
    # -----------------------------
    # TIMESTAMPS
    # -----------------------------
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # -----------------------------
    # STRING REPRESENTATION
    # -----------------------------
    def __str__(self):
        name = self.get_full_name().strip() or "Unnamed User"
        return f"{name} | {self.username} | {self.get_role_display()}"
