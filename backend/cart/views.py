from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, get_or_create_cart
from .serializers import CartSerializer, CartItemSerializer
from product.models import Product,Color

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]  # Ensures only logged-in users can access

    def get_queryset(self):
        return self.queryset.filter(cart__user=self.request.user)

    def create(self, request):
        cart = get_or_create_cart(request.user)
        product_id = request.data.get("product_id")
        color_id = request.data.get("color_id")
        quantity = request.data.get("quantity", 1)  # Default to 1 if quantity is not provided

        # Check if the product and color combination is valid
        product = Product.objects.filter(id=product_id).first()
        color = Color.objects.filter(id=color_id).first()

        if not product or not color:
            return Response({"detail": "Invalid product or color."}, status=status.HTTP_400_BAD_REQUEST)

        if color not in product.colors.all():
            return Response({"detail": "Selected color is not available for this product."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the same product with the same color already exists in the cart
        existing_item = CartItem.objects.filter(cart=cart, product=product, color=color).first()

        if existing_item:
            # If the product with the same color is already in the cart, increase the quantity
            existing_item.quantity += quantity
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If the product with the specified color is not in the cart, create a new item
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(cart=cart)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, pk=None, partial=False):
        cart_item = self.get_object()
        serializer = self.get_serializer(cart_item, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
