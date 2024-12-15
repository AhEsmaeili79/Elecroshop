from django.utils.crypto import get_random_string
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Order, ShipmentPrice
from .serializers import OrderSerializer,ShipmentPriceSerializer
from cart.models import get_or_create_cart
from .permissions import IsCustomerOrSeller
from rest_framework.viewsets import ModelViewSet

class OrderViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing order instances.
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsCustomerOrSeller]

    def get_queryset(self):
        """
        Returns the queryset of orders based on the role of the authenticated user:
        - If the user is a customer, only their own orders are returned.
        - If the user is a seller, orders for their own products are returned.
        """
        user = self.request.user
        if user.role == 'seller':
            # Only return orders containing items with products owned by the seller
            return Order.objects.filter(items__product__seller=user).distinct()
        else:
            # For customers, return only their own orders
            return Order.objects.filter(user=user)

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



class ShipmentPriceViewSet(ModelViewSet):
    queryset = ShipmentPrice.objects.all()
    serializer_class = ShipmentPriceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdminUser()]