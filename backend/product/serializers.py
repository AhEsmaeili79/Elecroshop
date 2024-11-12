# product/serializers.py

from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    # Access seller's name directly
    seller = serializers.CharField(source="seller.username", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "quantity", "price", "main_photo", "model", "seller"]
