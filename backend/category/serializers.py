# category/serializers.py
from django.forms import CharField
from rest_framework import serializers
from .models import Category, SubCategory, Brand, Model


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = SubCategory
        fields = ["id", "name", "category"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name"]


class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ["id", "name", "brand", "sub_category"]
