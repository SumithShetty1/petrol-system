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

            "transaction_type",
            "original_transaction",

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

    is_reversal = serializers.SerializerMethodField()
    is_reversed = serializers.SerializerMethodField()
    original_transaction_id = serializers.SerializerMethodField()

    def get_customer_mobile(self, obj):
        request = self.context.get("request")

        if not request or not hasattr(request, "user"):
            return None

        user = request.user
        role = getattr(user, "role", None)

        if role == "admin":
            return obj.customer_mobile

        if role in ["owner", "manager"]:
            mobile = obj.customer_mobile or ""
            if len(mobile) >= 5:
                return mobile[:3] + "****" + mobile[-2:]
            return mobile

        return None
    
    # -----------------------------------
    # Identify reversal entry
    # -----------------------------------
    def get_is_reversal(self, obj):
        return obj.transaction_type == "reversal"

    # -----------------------------------
    # Check if reversed
    # -----------------------------------
    def get_is_reversed(self, obj):
        return hasattr(obj, "reversal_entry")

    # -----------------------------------
    # Link to original txn
    # -----------------------------------
    def get_original_transaction_id(self, obj):
        if obj.original_transaction:
            return obj.original_transaction.id
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

            "transaction_type",
            "is_reversal",
            "is_reversed",
            "original_transaction_id",

            "created_at",
        ]

        read_only_fields = fields
        