from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, get_or_create_cart
from .serializers import CartSerializer, CartItemSerializer
from product.models import Product, Color , ProductColorQuantity
from django.db.models import Q

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(cart__user=self.request.user)

    def create(self, request):
        cart = get_or_create_cart(request.user)
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1) 
        color_id = request.data.get("color_id")

        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"detail": "Invalid quantity value."}, status=status.HTTP_400_BAD_REQUEST)

        product = Product.objects.filter(id=product_id).first()
        color = Color.objects.filter(id=color_id).first()

        if not product:
            return Response({"detail": "Invalid product."}, status=status.HTTP_400_BAD_REQUEST)
        if not color or color not in product.colors.all():
            return Response({"detail": "Invalid color for this product."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_color_quantity = product.productcolorquantity_set.get(color=color)
            available_quantity = product_color_quantity.quantity
        except ProductColorQuantity.DoesNotExist:
            return Response({"detail": "Color not available for this product."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity > available_quantity:
            return Response(
                {"detail": "Quantity exceeds available stock for this color."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_item = CartItem.objects.filter(cart=cart, product=product, color=color).first()

        if existing_item:
            total_quantity = existing_item.quantity + quantity
            if total_quantity > available_quantity:
                return Response(
                    {"detail": "Total quantity exceeds available stock for this color."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            existing_item.quantity = total_quantity
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(cart=cart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, partial=False):
        cart_item = self.get_object()
        quantity = request.data.get("quantity")

        if not quantity:
            return Response({"detail": "Quantity is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"detail": "Invalid quantity value."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_color_quantity = cart_item.product.productcolorquantity_set.get(color=cart_item.color)
            available_quantity = product_color_quantity.quantity
        except ProductColorQuantity.DoesNotExist:
            return Response({"detail": "Color not available for this product."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity > available_quantity:
            return Response(
                {"detail": "Quantity exceeds available stock for this color."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        if quantity == 0:
            cart_item.delete()
            return Response({"detail": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)

        cart_item.quantity = quantity
        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)