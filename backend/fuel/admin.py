from django.contrib import admin
from .models import FuelRate


@admin.register(FuelRate)
class FuelRateAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "pump_name",
        "pump_location",
        "fuel_type_display",
        "price_per_litre",
        "updated_at",
        "created_at",
    )

    search_fields = (
        "pump__pump_name",
        "pump__location",
    )

    list_filter = (
        "fuel_type",
        "created_at",
        "updated_at",
    )

    ordering = ("-updated_at",)

    autocomplete_fields = ("pump",)

    list_select_related = ("pump",)

    list_per_page = 25

    date_hierarchy = "updated_at"

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    def pump_name(self, obj):
        return obj.pump.pump_name
    
    pump_name.short_description = "Pump"
    pump_name.admin_order_field = "pump__pump_name"


    def pump_location(self, obj):
        return obj.pump.location
    
    pump_location.short_description = "Location"
    pump_location.admin_order_field = "pump__location"


    def fuel_type_display(self, obj):
        return obj.get_fuel_type_display()
    
    fuel_type_display.short_description = "Fuel Type"
    fuel_type_display.admin_order_field = "fuel_type"

