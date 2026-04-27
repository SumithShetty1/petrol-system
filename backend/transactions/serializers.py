from rest_framework import serializers
from .models import Transaction


# -------------------------------
# Create Transaction Serializer
# -------------------------------
class TransactionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = [
            "id",

            "customer_name",
            "customer_mobile",

            "fuel_type",

            "original_amount",
            "final_amount",
            "quantity",

            "points_used",
            "points_earned",
            "remaining_points",

            "created_at",
        ]


# -------------------------------
# Transaction List Serializer
# -------------------------------
class TransactionListSerializer(
    serializers.ModelSerializer
):

    customer_mobile = (
        serializers.SerializerMethodField()
    )

    def get_customer_mobile(
        self,
        obj
    ):
        request = self.context.get(
            "request"
        )

        # Safety fallback
        if (
            not request or
            not hasattr(
                request,
                "user"
            )
        ):
            return None

        user = request.user
        role = getattr(
            user,
            "role",
            None
        )

        # Admin -> full access
        if role == "admin":
            return obj.customer_mobile

        # Owner / Manager -> masked
        if role in [
            "owner",
            "manager"
        ]:
            mobile = (
                obj.customer_mobile
                or ""
            )

            if len(mobile) >= 5:
                return (
                    mobile[:3]
                    + "****"
                    + mobile[-2:]
                )

            return mobile

        # Attendant -> hidden
        return None

    class Meta:
        model = Transaction

        fields = [
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

            "fuel_type",

            "original_amount",
            "final_amount",
            "quantity",

            "points_used",
            "points_earned",
            "remaining_points",

            "created_at",
        ]

        read_only_fields = [
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

            "fuel_type",

            "original_amount",
            "final_amount",
            "quantity",

            "points_used",
            "points_earned",
            "remaining_points",

            "created_at",
        ]
        