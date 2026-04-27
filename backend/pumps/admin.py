from django.contrib import admin
from .models import Pump


@admin.register(Pump)
class PumpAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pump_code",
        "pump_name",
        "location",
        "owner_name",
        "manager_name",
        "is_active",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "pump_code",
        "pump_name",
        "location",
        "owner__username",
        "owner__first_name",
        "owner__last_name",
        "manager__user__username",
        "manager__user__first_name",
        "manager__user__last_name",
    )

    list_filter = (
        "is_active",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = ("owner", "manager")

    list_select_related = ("owner", "manager", "manager__user",)

    ordering = ("pump_code",)

    list_per_page = 25

    date_hierarchy = "created_at"

    readonly_fields = (
        "created_at",
        "updated_at",
    )
    

    def owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.username
        return "-"
    owner_name.short_description = "Owner"
    owner_name.admin_order_field = "owner__first_name"

    def manager_name(self, obj):
        if obj.manager and obj.manager.user:
            return obj.manager.user.get_full_name() or obj.manager.user.username
        return "-"
    manager_name.short_description = "Manager"
    manager_name.admin_order_field = "manager__user__first_name"
    