from django.contrib import admin
from .models import Pump


@admin.register(Pump)
class PumpAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pump_name",
        "location",
        "owner_name",
        "manager_name",
        "created_at",
    )

    search_fields = (
        "pump_name",
        "location",
        "owner__username",
        "owner__first_name",
        "owner__last_name",
    )

    list_filter = (
        "created_at",
        "owner",
    )

    autocomplete_fields = ("owner", "manager")

    list_select_related = ("owner", "manager")

    ordering = ("-created_at",)

    list_per_page = 25

    date_hierarchy = "created_at"

    def owner_name(self, obj):
        if obj.owner:
            return obj.owner.get_full_name() or obj.owner.username
        return "-"
    owner_name.short_description = "Owner"
    owner_name.admin_order_field = "owner__first_name"

    def manager_name(self, obj):
        if obj.manager:
            return obj.manager.user.get_full_name() or obj.manager.user.username
        return "-"
    manager_name.short_description = "Manager"
    manager_name.admin_order_field = "manager__user__first_name"
    