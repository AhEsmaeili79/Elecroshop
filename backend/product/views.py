from rest_framework import viewsets, permissions
from .models import Product, Wishlist,Color
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ProductSerializer, WishlistSerializer,ColorSerializer
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


class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can manage their wishlist

    def list(self, request):
        """
        Get all products in the user's wishlist
        """
        wishlist = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist, many=True, context={'request': request})  # Pass the request context
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_to_wishlist(self, request, pk=None):
        """
        Add product to wishlist
        """
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=404)

        # Create wishlist entry
        wishlist_item = Wishlist.objects.create(user=request.user, product=product)
        return Response({"detail": "Product added to wishlist."}, status=201)

    @action(detail=True, methods=['delete'])
    def remove_from_wishlist(self, request, pk=None):
        """
        Remove product from wishlist
        """
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=404)

        # Remove from wishlist if it exists
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, product=product)
            wishlist_item.delete()
            return Response({"detail": "Product removed from wishlist."}, status=200)
        except Wishlist.DoesNotExist:
            return Response({"detail": "Product not in your wishlist."}, status=404)


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Read-only for unauthenticated users, write for authenticated ones