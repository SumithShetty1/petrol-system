from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "employee_name",
        "role",
        "phone",
        "owner_name",
        "pump_code",
        "pump_name",
        "is_active",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__username",
        "owner__first_name",
        "owner__last_name",
        "owner__username",
        "pump__pump_code",
        "pump__pump_name",
    )

    list_filter = (
        "user__role",
        "user__is_active",
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)

    list_select_related = ("user", "pump", "owner")

    list_per_page = 25

    date_hierarchy = "created_at"

    readonly_fields = (
        "created_at",
        "updated_at",
    )
    
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
    
    def owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.username
        return "—"

    owner_name.short_description = "Owner"
    owner_name.admin_order_field = "owner__first_name"

    def pump_code(self, obj):
        return obj.pump.pump_code if obj.pump else "—"
    pump_code.short_description = "Pump Code"
    pump_code.admin_order_field = "pump__pump_code"

    def pump_name(self, obj):
        return obj.pump.pump_name if obj.pump else "—"
    pump_name.short_description = "Pump Name"
    pump_name.admin_order_field = "pump__pump_name"
    
    def is_active(self, obj):
        return obj.user.is_active
    is_active.boolean = True
    is_active.short_description = "Active"
    is_active.admin_order_field = "user__is_active"
