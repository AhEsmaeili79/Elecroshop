# product/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import api_view


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "seller"

    def has_object_permission(self, request, view, obj):
        return obj.seller == request.user


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller]

    def perform_create(self, serializer):
        serializer.save(
            seller=self.request.user
        )  # Automatically set the seller to the logged-in user
