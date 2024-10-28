# category/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrSellerOrReadOnly(BasePermission):
    """
    Allow read-only access to all users, but restrict modifications to admin and seller users.
    """

    def has_permission(self, request, view):
        # Allow read-only access to everyone
        if request.method in SAFE_METHODS:
            return True

        # Allow only admin or users with `is_seller` attribute to create/update/delete
        return request.user.is_authenticated and (
            request.user.is_staff or getattr(request.user, "is_seller", False)
        )
