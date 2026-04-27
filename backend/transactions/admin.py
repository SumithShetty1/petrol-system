from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
    
        "customer_name",
        "customer_mobile",

        "pump_code",
        "pump_name",
        "pump_location",
    
        "attendant_name",
        "attendant_phone",
    
        "manager_name",
        "manager_phone",
    
        "fuel_type_display",
    
        "original_amount",
        "final_amount",
        "quantity",
    
        "points_used",
        "points_earned",
        "remaining_points",
    
        "created_at",
    )

    search_fields = (
        "customer_name",
        "customer_mobile",
        "pump_code",
        "pump_name",
        "pump_location",
        "attendant_name",
        "attendant_phone",
        "manager_name",
        "manager_phone",
    )

    list_filter = (
        "fuel_type",
        "created_at",
    )

    ordering = ("-created_at",)

    date_hierarchy = "created_at"

    list_per_page = 25

    list_select_related = (
        "customer",
        "pump",
        "attendant",
        "manager",
    )

    autocomplete_fields = (
        "customer",
        "pump",
        "attendant",
        "manager",
    )

    readonly_fields = (
        "id",

        "customer",
        "pump",
        "attendant",
        "manager",

        "customer_name",
        "customer_mobile",

        "pump_code",
        "pump_name",
        "pump_location",

        "attendant_name",
        "attendant_phone",

        "manager_name",
        "manager_phone",

        "fuel_type",

        "original_amount",
        "final_amount",
        "quantity",

        "points_used",
        "points_earned",
        "remaining_points",

        "created_at",
    )

    fieldsets = (
        ("Relations", {
            "fields": (
                "customer",
                "pump",
                "attendant",
                "manager",
            )
        }),

        ("Customer Snapshot", {
            "fields": (
                "customer_name",
                "customer_mobile",
            )
        }),

        ("Pump Snapshot", {
            "fields": (
                "pump_code",
                "pump_name",
                "pump_location",
            )
        }),

        ("Staff Snapshot", {
            "fields": (
                "attendant_name",
                "attendant_phone",
                "manager_name",
                "manager_phone",
            )
        }),

        ("Transaction Details", {
            "fields": (
                "fuel_type",
                "original_amount",
                "final_amount",
                "quantity",
            )
        }),

        ("Points", {
            "fields": (
                "points_used",
                "points_earned",
                "remaining_points",
            )
        }),

        ("Metadata", {
            "fields": (
                "id",
                "created_at",
            )
        }),
    )

    def fuel_type_display(self, obj):
        return obj.get_fuel_type_display()

    fuel_type_display.short_description = "Fuel Type"
    fuel_type_display.admin_order_field = "fuel_type"

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return request.method in ["GET", "HEAD", "OPTIONS"]

    def has_view_permission(self, request, obj=None):
        return True
    