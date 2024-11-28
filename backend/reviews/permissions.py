from rest_framework import permissions

class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow:
    - Anyone to read reviews.
    - Only authenticated users to create reviews.
    - Users to update/delete their own reviews.
    - Admins to update/delete any reviews.
    """

    def has_permission(self, request, view):
        # Allow all users to read (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for other methods
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read-only methods for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Log the user IDs for debugging
        print(f"Checking permission for review owner {obj.user.id} and user {request.user.id}")
        
        # Allow owners of the object or admins to modify/delete
        return obj.user == request.user or request.user.is_staff
