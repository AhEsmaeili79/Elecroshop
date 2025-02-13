from rest_framework import serializers
from .models import Product, Color, Wishlist, ProductColorQuantity
from category.models import Category
from category.serializers import CategorySerializer

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "color_hex"] 

class ProductColorQuantitySerializer(serializers.ModelSerializer):
    color_hex = serializers.ReadOnlyField(source='color.color_hex')

    class Meta:
        model = ProductColorQuantity
        fields = ['color', 'color_hex', 'quantity']


class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.CharField(source="seller.username", read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  
    is_in_wishlist = serializers.SerializerMethodField()
    color_quantities = ProductColorQuantitySerializer(source='productcolorquantity_set', many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            "id", 
            "name", 
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
            "color_quantities", 
            "brand",
            "is_in_wishlist",
            "created_at",
        ]
    
    def get_is_in_wishlist(self, obj):
        user = self.context.get('request').user  
        if user.is_authenticated:
            return Wishlist.objects.filter(user=user, product=obj).exists()  
        return False

    def validate_category(self, value):
        if not Category.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid category ID.")
        return value


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

        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("Product is already in your wishlist.")

        wishlist_item = Wishlist.objects.create(user=user, product=product)
        return wishlist_item 
