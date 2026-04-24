from django.db import models
from pumps.models import Pump

class FuelRate(models.Model):
    FUEL_TYPES = (
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
    )

    pump = models.ForeignKey(Pump, on_delete=models.CASCADE, related_name='fuel_rates')
    fuel_type = models.CharField(max_length=10, choices=FUEL_TYPES)
    price_per_litre = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['pump', 'fuel_type'], name='unique_pump_fuel')
        ]
        ordering = ['-updated_at']
        
    def __str__(self):
        return (
            f"{self.pump.pump_name} ({self.pump.location}) | "
            f"{self.get_fuel_type_display()} | "
            f"₹{self.price_per_litre}/L"
        )
