from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import ProductSerializer,ColorSerializer 
from product.models import Product,Color,ProductColorQuantity


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)   
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )
    color_id = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), source="color", write_only=True
    )
    color = ColorSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "color", "color_id", "quantity", "total_price"]

    def validate(self, data):
        product = data.get('product')
        color = data.get('color')
        quantity = data.get('quantity')

        if not product or not color or quantity <= 0:
            raise serializers.ValidationError("Product, color, and valid quantity are required.")

        try:
            product_color_quantity = product.productcolorquantity_set.get(color=color)
            available_quantity = product_color_quantity.quantity
        except ProductColorQuantity.DoesNotExist:
            raise serializers.ValidationError(f"Color {color.color_hex} is not available for product {product.name}.")
        
        if quantity > available_quantity:
            raise serializers.ValidationError(f"Not enough stock for color {color.color_hex} of {product.name}. Available: {available_quantity}, Requested: {quantity}.")

        return data

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ["id", "user", "cart_items", "total_price"]
