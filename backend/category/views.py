# category/views.py
from rest_framework import viewsets
from .models import Category, SubCategory, Brand, Model
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    BrandSerializer,
    ModelSerializer,
)
from .permissions import IsAdminOrSellerOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrSellerOrReadOnly]


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAdminOrSellerOrReadOnly]


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrSellerOrReadOnly]


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer
    permission_classes = [IsAdminOrSellerOrReadOnly]
