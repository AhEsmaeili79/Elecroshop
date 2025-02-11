from rest_framework import permissions

class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        print(f"Checking permission for review owner {obj.user.id} and user {request.user.id}")
        
        return obj.user == request.user or request.user.is_staff
