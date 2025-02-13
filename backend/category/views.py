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
        return Category.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        return SubCategory.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        return Brand.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all() 
    serializer_class = ModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        return Model.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
