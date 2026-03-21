from django.db import models
from pumps.models import Pump
from employees.models import Employee
from decimal import Decimal


class Transaction(models.Model):

    FUEL_TYPES = (
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
    )

    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='transactions')
    pump = models.ForeignKey(Pump, on_delete=models.CASCADE, related_name='transactions')
    attendant = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='transactions')

    fuel_type = models.CharField(max_length=10, choices=FUEL_TYPES)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)

    points_used = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    points_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.name} - ₹{self.amount} ({self.fuel_type})"
    