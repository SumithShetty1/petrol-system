from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import transaction

from .models import Customer, PointsHistory


# -----------------------------------
# CUSTOMER ADMIN
# -----------------------------------
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "mobile_number",
        "total_points",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "name",
        "mobile_number",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 25

    readonly_fields = (
        "total_points",
        "created_at",
        "updated_at",
    )


# -----------------------------------
# POINTS HISTORY ADMIN
# -----------------------------------
@admin.register(PointsHistory)
class PointsHistoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer_name",
        "customer_mobile",
        "transaction",
        "type",
        "reversed_from_id",
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

    autocomplete_fields = (
        "customer",
        "transaction",
    )

    readonly_fields = (
        "id",
        "customer_name",
        "customer_mobile",
        "balance_after",
        "created_at",
        "created_by",
        "reversed_from",
    )

    # -----------------------------------
    # PERMISSIONS
    # -----------------------------------
    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return request.method in ["GET", "HEAD", "OPTIONS"]

    def has_view_permission(self, request, obj=None):
        return True

    # -----------------------------------
    # DISPLAY HELPER
    # -----------------------------------
    def reversed_from_id(self, obj):
        if obj.reversed_from:
            return obj.reversed_from.id
        return "-"

    reversed_from_id.short_description = "Reversed From"

    # -----------------------------------
    # SAVE LOGIC (ONLY ADJUSTMENTS)
    # -----------------------------------
    @transaction.atomic
    def save_model(self, request, obj, form, change):
        if not change:  # only on create

            customer = obj.customer

            if not customer:
                raise ValidationError("Customer is required")

            if obj.points_change == 0:
                raise ValidationError("Points cannot be zero")

            if obj.type != "adjustment":
                raise ValidationError("Only adjustments can be created via admin")

            # -------------------------
            # SNAPSHOT
            # -------------------------
            obj.customer_name = customer.name
            obj.customer_mobile = customer.mobile_number

            # -------------------------
            # UPDATE BALANCE
            # -------------------------
            new_balance = customer.total_points + obj.points_change

            if new_balance < 0:
                raise ValidationError("Customer points cannot go negative")

            customer.total_points = new_balance
            customer.save()

            obj.balance_after = new_balance

            # -------------------------
            # AUDIT
            # -------------------------
            obj.created_by = request.user

        super().save_model(request, obj, form, change)

    # -----------------------------------
    # FORM CONTROL
    # -----------------------------------
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        if obj:
            # lock all critical fields
            for field in [
                "points_change",
                "type",
                "customer",
                "transaction",
                "created_by",
                "adjustment_reason",
                "reversed_from",
            ]:
                if field in form.base_fields:
                    form.base_fields[field].disabled = True

        else:
            form.base_fields["type"].initial = "adjustment"
            form.base_fields["type"].disabled = True

        return form
    