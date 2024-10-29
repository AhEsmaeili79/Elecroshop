from django.utils.crypto import get_random_string
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from cart.models import get_or_create_cart


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart = get_or_create_cart(self.request.user)
        cart_items = cart.cart_items.all()

        # Calculate total price
        total_price = sum(item.total_price for item in cart_items)
        shipment_price = 10.00

        # Create the order with total price and shipment price
        serializer.save(
            user=self.request.user,
            total_price=total_price + shipment_price,
            shipment_price=shipment_price,
            order_code=get_random_string(7, allowed_chars="0123456789"),
        )

        # Clear cart items and update product quantities
        for item in cart_items:
            item.product.quantity -= item.quantity
            item.product.save()

        cart_items.delete()  # Clear the cart items
