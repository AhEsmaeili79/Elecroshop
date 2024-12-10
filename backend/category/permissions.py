# category/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdminOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read-only permissions for GET, HEAD, and OPTIONS
        if request.method in SAFE_METHODS:
            return True
        # Allow the owner or an admin to modify the object
        return obj.owner == request.user or request.user.is_superuser

    def has_permission(self, request, view):
        # Allow unauthenticated users to read (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True
        # Other methods (POST, PUT, DELETE) require authentication
        return request.user and request.user.is_authenticated
