# your_app/permissions.py

from rest_framework import permissions


class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow:
    - Sellers to perform CRUD on their own products
    - Customers (and other users) to view products (read-only access)
    """

    def has_permission(self, request, view):
        # Allow read access to any user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow write access only to sellers
        return request.user.is_authenticated and request.user.role == "seller"

    def has_object_permission(self, request, view, obj):
        # Allow read-only permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow the seller or admin to edit/delete their own products
        return obj.seller == request.user
