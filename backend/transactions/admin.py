from django.contrib import admin, messages
from django.http import HttpResponse
import csv

from .models import Transaction
from .services import reverse_transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = (
        "id",

        "transaction_type",
        "original_txn_id",

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
        "transaction_type",        
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
        "original_transaction",  
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

        "transaction_type",
        "original_transaction",

        "created_at",
    )

    # -----------------------------------
    # BULK ACTIONS
    # -----------------------------------
    actions = ["export_as_csv", "reverse_transactions"]

    # -----------------------------------
    # FORM GROUPING
    # -----------------------------------
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

        ("Reversal Info", {
            "fields": (
                "transaction_type",
                "original_transaction",
            )
        }),

        ("Metadata", {
            "fields": (
                "id",
                "created_at",
            )
        }),
    )

    # -----------------------------------
    # DISPLAY HELPERS
    # -----------------------------------

    def fuel_type_display(self, obj):
        return obj.get_fuel_type_display()

    fuel_type_display.short_description = "Fuel Type"
    fuel_type_display.admin_order_field = "fuel_type"

    def original_txn_id(self, obj):
        if obj.original_transaction:
            return obj.original_transaction.id
        return "-"
    
    original_txn_id.short_description = "Original TXN"

    # -----------------------------------
    # PERMISSIONS
    # -----------------------------------

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return request.method in ["GET", "HEAD", "OPTIONS"]

    def has_view_permission(self, request, obj=None):
        return True

    # -----------------------------------
    # REVERSAL ACTION
    # -----------------------------------

    def reverse_transactions(self, request, queryset):

        success = 0
        failed = 0

        for txn in queryset:
            try:
                if txn.transaction_type == "reversal" or hasattr(txn, "reversal_entry"):
                    raise ValueError("Cannot reverse this transaction")

                reverse_transaction(txn)

                success += 1

            except Exception as e:
                failed += 1
                self.message_user(
                    request,
                    f"TXN {txn.id}: {str(e)}",
                    level=messages.ERROR
                )

        if success:
            self.message_user(
                request,
                f"{success} transaction(s) reversed successfully",
                level=messages.SUCCESS
            )

        if failed:
            self.message_user(
                request,
                f"{failed} transaction(s) failed",
                level=messages.WARNING
            )

    reverse_transactions.short_description = "Reverse selected transactions"

    # -----------------------------------
    # CSV EXPORT
    # -----------------------------------

    def export_as_csv(self, request, queryset):

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="transactions.csv"'

        response.write('\ufeff')

        writer = csv.writer(response, lineterminator="\n")

        # Header
        writer.writerow([
            "ID",
            "Type",                 
            "Reversed TXN ID",      
            "Customer Name",
            "Customer Mobile",
            "Pump Code",
            "Pump Name",
            "Location",
            "Attendant Name",
            "Attendant Phone",
            "Manager Name",
            "Manager Phone",
            "Fuel Type",
            "Original Amount",
            "Final Amount",
            "Quantity",
            "Points Used",
            "Points Earned",
            "Remaining Points",
            "Created At",
        ])

        # Rows
        for obj in queryset:
            writer.writerow([
                obj.id,
                obj.transaction_type,
                obj.original_transaction.id if obj.original_transaction else "",
                obj.customer_name,
                obj.customer_mobile,
                obj.pump_code,
                obj.pump_name,
                obj.pump_location,
                obj.attendant_name,
                obj.attendant_phone,
                obj.manager_name,
                obj.manager_phone,
                obj.get_fuel_type_display(),
                obj.original_amount,
                obj.final_amount,
                obj.quantity,
                obj.points_used,
                obj.points_earned,
                obj.remaining_points,
                obj.created_at,
            ])

        return response

    export_as_csv.short_description = "Download selected transactions as CSV"
