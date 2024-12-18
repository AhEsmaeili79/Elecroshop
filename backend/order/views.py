from django.utils.crypto import get_random_string
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Order,OrderItem, ShipmentPrice
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
        user = self.request.user
        order_code = self.request.query_params.get('order_code', None)
        
        if order_code:
            return Order.objects.filter(order_code=order_code)
        
        if user.role == 'seller':
            return Order.objects.filter(items__product__seller=user).distinct()
        else:
            return Order.objects.filter(user=user)


    def perform_create(self, serializer):
        """
        Create a new order instance, linking it to the user's cart.
        """
        cart = get_or_create_cart(self.request.user)
        cart_items = cart.cart_items.all()

        # Retrieve the shipment price directly using the passed ID
        shipment_price = ShipmentPrice.objects.get(id=self.request.data['shipment_price'])  # Fix here

    
        # Save the order
        order = serializer.save(
            user=self.request.user,
            shipment_price=shipment_price,
        )

        # Link cart items to the order
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                color=item.color
            )
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