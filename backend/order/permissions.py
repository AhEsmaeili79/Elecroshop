from rest_framework.permissions import BasePermission

class IsCustomerOrSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'seller':
            return obj.items.filter(product__seller=request.user).exists()
        return obj.user == request.user
