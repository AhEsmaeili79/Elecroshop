from rest_framework import serializers
from .models import Order, OrderItem, ShipmentPrice, Payment
from product.serializers import ColorSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.main_photo", read_only=True)
    product_price = serializers.IntegerField(source="product.price", read_only=True)
    product_seller = serializers.CharField(source="product.seller", read_only=True)
    color = ColorSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "product_seller",
            "quantity",
            "color",  # Include color field
        ]

    def to_representation(self, instance):
        user = self.context.get("request").user
        if user.role == "seller" and instance.product.seller != user:
            return {}  # Return empty data for items not belonging to the seller
        return super().to_representation(instance)


class ShipmentPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentPrice
        fields = ["id", "title", "price"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "amount",
            "payment_method",
            "status",
            "transaction_ref_id",
            "authority",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "order",
            "status",
            "transaction_ref_id",
            "authority",
            "created_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipment_price_amount = serializers.IntegerField(
        source="shipment_price.price", read_only=True
    )
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_code",
            "shipment_price",
            "shipment_price_amount",
            "address",
            "payment_type",
            "status",
            "items",
            "payment",
            "created_at_date",
            "created_at_time",
            "total_amount",
        ]
        read_only_fields = [
            "id",
            "order_code",
            "status",
            "created_at_date",
            "created_at_time",
            "payment",
        ]

    def create(self, validated_data):
        items_data = self.context["items_data"]
        shipment_price = validated_data.get("shipment_price")

        # Calculate total amount based on items_data
        total_amount = sum(
            item["product"].price * item["quantity"] for item in items_data
        ) + shipment_price.price

        # Remove `total_amount` from `validated_data` to avoid conflicts
        if "total_amount" in validated_data:
            del validated_data["total_amount"]

        # Create the order
        order = Order.objects.create(
            **validated_data,
            total_amount=total_amount,
        )

        # Create OrderItem instances for each item
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                quantity=item["quantity"],
                color=item.get("color"),  # Handle cases where color might be None
            )

        # Create an initial Payment instance for the order
        Payment.objects.create(
            order=order,
            amount=total_amount,
            payment_method=validated_data.get("payment_type"),
            status="pending",
        )

        return order
