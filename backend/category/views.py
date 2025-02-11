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
    queryset = Category.objects.all() 
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset()
            return self.queryset.filter(owner=self.request.user)
        return Category.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset() 
            return self.queryset.filter(
                owner=self.request.user
            )
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
                return super().get_queryset()  
            return self.queryset.filter(owner=self.request.user) 
        return Brand.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all() 
    serializer_class = ModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return super().get_queryset() 
            return self.queryset.filter(owner=self.request.user) 
        return Model.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
