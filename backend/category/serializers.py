from rest_framework import serializers
from .models import Category, SubCategory, Brand, Model


class CategorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Category
        fields = ["id", "name", "owner","image"]


class SubCategorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = SubCategory
        fields = ["id", "name", "category", "owner", "category_name"]
        read_only_fields = [
            "owner"
        ] 

    def create(self, validated_data):
        return super().create(validated_data)


class BrandSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Brand
        fields = ["id", "name", "owner"]


class ModelSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Model
        fields = ["id", "name", "brand", "sub_category", "owner"]

