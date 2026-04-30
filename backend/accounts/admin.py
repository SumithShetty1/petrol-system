from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register the custom User model with Django Admin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    # -----------------------------
    # LIST VIEW CONFIGURATION
    # -----------------------------
    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
    )

    list_filter = ("role", "is_active", "is_staff", "is_superuser")

    search_fields = ("username", "first_name", "last_name")

    ordering = ("-id",)

    # -----------------------------
    # READ-ONLY FIELDS
    # -----------------------------
    readonly_fields = ("last_login", "date_joined", "created_at", "updated_at",)
    
    list_per_page = 25

    date_hierarchy = "created_at"

    # -----------------------------
    # FIELDSETS (EDIT VIEW)
    # -----------------------------
    fieldsets = UserAdmin.fieldsets + (
        (
            "Custom Fields",
            {
                "fields": (
                    "role",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    # -----------------------------
    # ADD USER VIEW CONFIGURATION
    # -----------------------------
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {
            "fields": ("role",),
        }),
    )
    
    # -----------------------------
    # PERMISSION CONTROL
    # -----------------------------
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            return self.readonly_fields + ("is_superuser",)
        return self.readonly_fields
    