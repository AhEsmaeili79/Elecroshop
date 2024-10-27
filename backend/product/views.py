# /views.py

from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from .Pagination.pagination import ProductPagination
from .Permissions.permissions import IsSellerOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically set the seller to the logged-in user
        serializer.save(seller=self.request.user)
