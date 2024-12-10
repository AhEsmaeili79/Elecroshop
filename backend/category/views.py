# category/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, SubCategory, Brand, Model
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    BrandSerializer,
    ModelSerializer,
)
from .permissions import IsOwnerOrAdminOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()  # Default queryset for the router
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset()  # Return all categories for admin
            return self.queryset.filter(owner=self.request.user)  # Return user's categories
        # Allow unauthenticated users to see categories in read-only mode
        return Category.objects.all()  # All categories can be viewed, but not modified for unauthenticated users

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset()  # Return all subcategories for admin
            return self.queryset.filter(
                owner=self.request.user
            )  # Return user's subcategories
        return SubCategory.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset()  # Return all categories for admin
            return self.queryset.filter(owner=self.request.user)  # Return user's categories
        # Allow unauthenticated users to see categories in read-only mode
        return Brand.objects.all()  # All categories can be viewed, but not modified for unauthenticated users

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()  # Default queryset for the router
    serializer_class = ModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset()  # Return all models for admin
            return self.queryset.filter(owner=self.request.user)  # Return user's models
        return Model.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
