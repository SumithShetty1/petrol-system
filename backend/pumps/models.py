from django.db import models

class Pump(models.Model):

    pump_name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.pump_name
    