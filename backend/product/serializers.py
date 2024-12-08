from rest_framework import serializers
from .models import Product, Color, Wishlist  # Import the Color model
from category.serializers import CategorySerializer
# Create the ColorSerializer to handle color-related information

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "color_hex"]  # Include any other relevant fields in the Color model

class ProductSerializer(serializers.ModelSerializer):
    # Access seller's name directly
    seller = serializers.CharField(source="seller.username", read_only=True)
    category = CategorySerializer(read_only=True)
    is_in_wishlist = serializers.SerializerMethodField()
    # Use the ColorSerializer to handle multiple colors
    colors = ColorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            "id", 
            "name", 
            "quantity", 
            "price", 
            "desc", 
            "main_photo", 
            "photo1", 
            "photo2", 
            "photo3", 
            "model", 
            "seller", 
            "category", 
            "is_favorited_by", 
            "colors",
            "brand",
            "is_in_wishlist",
            "created_at",
        ]
    
    def get_is_in_wishlist(self, obj):
        user = self.context.get('request').user  # Get the current user from the request context
        if user.is_authenticated:
            return Wishlist.objects.filter(user=user, product=obj).exists()  # Check if the user has the product in their wishlist
        return False


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.CharField(source='product.id', read_only=True)
    added_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['product_id', 'added_at', 'user', 'product']

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']

        # Check if the product is already in the wishlist
        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("Product is already in your wishlist.")

        # Add the product to the wishlist
        wishlist_item = Wishlist.objects.create(user=user, product=product)
        return wishlist_item 
