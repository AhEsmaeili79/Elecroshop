from rest_framework.permissions import BasePermission

class IsCustomerOrSeller(BasePermission):
    """
    Allows access only to customers or sellers for specific conditions.
    """
    def has_permission(self, request, view):
        # Ensure that the user is authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Sellers can view orders if the order contains their products
        if request.user.role == 'seller':
            return obj.items.filter(product__seller=request.user).exists()
        # Customers can view their own orders
        return obj.user == request.user
