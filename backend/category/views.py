from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, SubCategory, Brand, Model
from django.contrib.auth import get_user_model
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    BrandSerializer,
    ModelSerializer,
)
from .permissions import IsOwnerOrAdminOrReadOnly



User = get_user_model()


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


class SellerCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.ADMIN]:
            return Category.objects.all()
        return Category.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
