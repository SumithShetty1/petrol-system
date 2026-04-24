from django.contrib import admin
from .models import Customer, PointsHistory


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "mobile_number",
        "total_points",
        "created_at",
    )

    search_fields = (
        "name",
        "mobile_number",
    )

    list_filter = (
        "created_at",
    )

    ordering = ("-created_at",)

    date_hierarchy = "created_at"

    list_per_page = 25

    readonly_fields = (
        "total_points",
        "created_at",
    )


@admin.register(PointsHistory)
class PointsHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_mobile",
        "type",
        "points_change",
        "balance_after",
        "created_at",
    )

    search_fields = (
        "customer_name",
        "customer_mobile",
    )

    list_filter = (
        "type",
        "created_at",
    )

    ordering = ("-created_at",)

    date_hierarchy = "created_at"

    list_per_page = 25

    list_select_related = ("customer", "transaction")

    readonly_fields = (
        "id",
        "customer",
        "transaction",
        "customer_name",
        "customer_mobile",
        "points_change",
        "balance_after",
        "type",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return request.method in ["GET", "HEAD", "OPTIONS"]

    def has_view_permission(self, request, obj=None):
        return True
