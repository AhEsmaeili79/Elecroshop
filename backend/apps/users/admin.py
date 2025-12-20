from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = [
        'id',
        'email',
        'phone',
        'is_active',
        'is_staff',
        'is_superuser',
        'is_deleted',
        'created_at',
        'deleted_at',
    ]
    
    list_filter = [
        'is_active',
        'is_staff',
        'is_superuser',
        'is_deleted',
        'created_at',
    ]
    
    search_fields = ['email', 'phone', 'id']
    
    readonly_fields = ['id', 'created_at', 'updated_at', 'deleted_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'email', 'phone', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Soft Delete', {'fields': ('is_deleted', 'deleted_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'password1', 'password2'),
        }),
    )
    
    filter_horizontal = []  # Remove groups and user_permissions
    
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        """Return queryset including soft-deleted users."""
        qs = self.model.all_objects.get_queryset()
        ordering = self.get_ordering(request)
        if ordering:
            qs = qs.order_by(*ordering)
        return qs
