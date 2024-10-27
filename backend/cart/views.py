from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from .models import get_or_create_cart


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
        print(self.request.user.id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(cart=cart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        cart_item = self.get_object()
        serializer = self.get_serializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
