from django.contrib import admin
from .models import Customer, PointsHistory

# Register your models here.
admin.site.register(Customer)
admin.site.register(PointsHistory)
