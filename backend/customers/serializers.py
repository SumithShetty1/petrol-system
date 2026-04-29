from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from .models import Customer, PointsHistory


class CustomerSerializer(serializers.ModelSerializer):
    can_redeem = serializers.SerializerMethodField()
    next_redeem_at = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "mobile_number",
            "total_points",

            "can_redeem",
            "next_redeem_at",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "total_points",
            "created_at",
            "updated_at",
        ]

    # -----------------------------------
    # LAST REDEEM HELPER
    # -----------------------------------
    def _get_last_redeem(self, obj):
        if not hasattr(obj, "_last_redeem_cache"):
            obj._last_redeem_cache = (
                obj.points_history
                .filter(
                    type="redeem",
                    reversed_from__isnull=True
                )
                .order_by("-created_at")
                .first()
            )
        return obj._last_redeem_cache

    # -----------------------------------
    # CAN REDEEM?
    # -----------------------------------
    def get_can_redeem(self, obj):
        last_redeem = self._get_last_redeem(obj)

        if not last_redeem:
            return True

        next_allowed = last_redeem.created_at + timedelta(days=7)

        return timezone.now() >= next_allowed

    # -----------------------------------
    # NEXT REDEEM DATE
    # -----------------------------------
    def get_next_redeem_at(self, obj):
        last_redeem = self._get_last_redeem(obj)

        if not last_redeem:
            return None

        return last_redeem.created_at + timedelta(days=7)
        