# /views.py

# from typing_extensions import ReadOnly
from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer
from .Pagination.pagination import ProductPagination
from .Permissions.permissions import IsSellerOrReadOnly


# Seller CRUD
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # If the user is a seller, filter products by that seller
        if user.is_authenticated and user.role == "seller":
            return Product.objects.filter(seller=user)
        # If the user is not a seller, return an empty queryset
        return Product.objects.none()

    def perform_create(self, serializer):
        # Automatically set the seller to the logged-in user
        serializer.save(seller=self.request.user)


class CustomerProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()  # Fetch all products
    serializer_class = ProductSerializer
    permission_classes = []  # Allow read-only access to everyone
