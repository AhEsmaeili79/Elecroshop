from rest_framework import permissions, viewsets
from .models import Product
from .serializers import ProductSerializer


class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow:
    - Sellers to perform CRUD on their own products
    - Customers (and other users) to view products (read-only access)
    """

    def has_permission(self, request, view):
        # Allow any authenticated user to view (GET) products
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow sellers to create, update, and delete products
        return request.user.is_authenticated and request.user.role == "seller"

    def has_object_permission(self, request, view, obj):
        # Allow read-only permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow the seller to edit/delete their own products
        return obj.seller == request.user


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsSellerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically set the seller to the logged-in user
        serializer.save(seller=self.request.user)
