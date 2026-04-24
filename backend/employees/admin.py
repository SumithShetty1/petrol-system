from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "employee_name",
        "role",
        "phone",
        "pump_name",
        "is_active",
        "created_at",
    )

    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__username",
        "pump__pump_name",
    )

    list_filter = (
        "user__role",
        "user__is_active",
        "pump__pump_name",
        "created_at",
    )

    ordering = ("-created_at",)

    autocomplete_fields = ("user", "pump")

    list_select_related = ("user", "pump")

    list_per_page = 25

    date_hierarchy = "created_at"

    def employee_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    employee_name.short_description = "Employee"
    employee_name.admin_order_field = "user__first_name"
    
    
    def role(self, obj):
        return obj.user.get_role_display()
    role.short_description = "Role"
    role.admin_order_field = "user__role"
    
    
    def phone(self, obj):
        return obj.user.username
    phone.short_description = "Phone"
    phone.admin_order_field = "user__username"
    
    
    def pump_name(self, obj):
        return obj.pump.pump_name
    pump_name.short_description = "Pump"
    pump_name.admin_order_field = "pump__pump_name"
    
    
    def is_active(self, obj):
        return obj.user.is_active
    is_active.boolean = True
    is_active.short_description = "Active"
    is_active.admin_order_field = "user__is_active"
