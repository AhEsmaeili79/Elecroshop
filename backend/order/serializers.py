from rest_framework import serializers
from .models import Order, OrderItem, ShipmentPrice
from product.serializers import ColorSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.main_photo", read_only=True)
    product_price = serializers.IntegerField(source="product.price", read_only=True)
    product_seller = serializers.CharField(source="product.seller", read_only=True)
    # color = serializers.CharField(source="product.colors", read_only=True)
    
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
            'color',
        ]

    def to_representation(self, instance):
        """
        Override the to_representation method to filter out items that do not belong to the seller.
        """
        user = self.context.get('request').user
        if user.role == 'seller' and instance.product.seller != user:
            return {}  # Return empty data for items not belonging to the seller
        return super().to_representation(instance)

class ShipmentPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentPrice
        fields = ['id','title','price']
        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    shipment_price_amount = serializers.IntegerField(
        source='shipment_price.price',  # Accessing the price of the associated ShipmentPrice
        read_only=True,
    )
    
    class Meta:
        model = Order
        fields = [
            "id",
            "order_code",
            "shipment_price",
            "shipment_price_amount",
            "address",
            "payment_type",
            "items",
            'created_at_date',
            'created_at_time',
        ]
        read_only_fields = [
            "user",
            "order_code",
            "status",
            "created_at_date",
            "created_at_time",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")  # Extract items data
        order = Order.objects.create(**validated_data)  # Create the order instance

        # Create OrderItem instances for each item
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)  # Link each item to the order
        return order

