from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
    )

    list_filter = ("role", "is_active", "is_staff", "is_superuser")

    search_fields = ("username", "first_name", "last_name")

    ordering = ("-id",)

    readonly_fields = ("last_login", "date_joined")
    
    list_per_page = 25

    date_hierarchy = "date_joined"

    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {
            "fields": ("role",),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {
            "fields": ("role",),
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            return self.readonly_fields + ("is_superuser",)
        return self.readonly_fields
    