# views.py
from django.utils.crypto import get_random_string
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from cart.models import get_or_create_cart


class OrderViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing order instances.
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return the orders that belong to the authenticated user
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Create a new order instance, linking it to the user's cart.
        """
        cart = get_or_create_cart(self.request.user)
        cart_items = cart.cart_items.all()

        # Calculate total price including shipment
        total_price = sum(item.total_price for item in cart_items)
        shipment_price = 10.00  # You may want to make this configurable

        # Create the order
        serializer.save(
            user=self.request.user,
            total_price=total_price + shipment_price,
            shipment_price=shipment_price,
            order_code=get_random_string(7, allowed_chars="0123456789"),
        )

        # Update product quantities and clear the cart
        for item in cart_items:
            item.product.quantity -= item.quantity
            item.product.save()
        cart_items.delete()  # Clear the cart items
