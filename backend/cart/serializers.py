from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import ProductSerializer,ColorSerializer 
from product.models import Product,Color


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
        
class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ["id", "user", "cart_items", "total_price"]
