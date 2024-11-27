# category/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdminOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read-only permissions for any request method in SAFE_METHODS (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the object or an admin
        return obj.owner == request.user or request.user.is_staff

    def has_permission(self, request, view):
        # Allow read-only permissions for unauthenticated users
        if request.method in SAFE_METHODS:
            return True
        
        # For other methods (POST, PUT, DELETE), ensure the user is authenticated
        return request.user and request.user.is_authenticated
