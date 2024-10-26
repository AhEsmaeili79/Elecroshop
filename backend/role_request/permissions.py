# role_request/permissions.py
from rest_framework.permissions import BasePermission


class IsAdminOrSuperUser(BasePermission):
    """
    Custom permission to only allow admins or superusers to access the view.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if request.user and request.user.is_authenticated:
            return request.user.is_superuser or request.user.is_staff
        return False
