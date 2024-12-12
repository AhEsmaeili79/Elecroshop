from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an address to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the address (the username field is set to the user).
        return obj.username == request.user
