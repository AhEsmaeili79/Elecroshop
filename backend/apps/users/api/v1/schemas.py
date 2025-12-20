"""
Dynamic OpenAPI schemas for users endpoints.
These schemas are automatically generated based on serializer fields.
"""
from drf_spectacular.utils import extend_schema_serializer, inline_serializer
from rest_framework import serializers

from apps.users.api.v1.serializers import UserSerializer, UserUpdateSerializer


# User Profile Response Schema - dynamically generated from UserSerializer
# Using the serializer directly ensures it stays in sync with the actual serializer
user_profile_response_schema = UserSerializer

# User Update Request Schema - dynamically generated from UserUpdateSerializer
# Using the serializer directly ensures it stays in sync with the actual serializer
user_update_request_schema = UserUpdateSerializer

# User Update Response Schema - dynamically generated from UserSerializer
# Returns the updated user profile
user_update_response_schema = UserSerializer

# User Profile Success Response Schema - with message
user_profile_success_response_schema = inline_serializer(
    name='UserProfileResponse',
    fields={
        'id': serializers.IntegerField(help_text='User ID'),
        'email': serializers.EmailField(
            required=False,
            allow_null=True,
            help_text='User email address'
        ),
        'phone': serializers.CharField(
            required=False,
            allow_null=True,
            max_length=20,
            help_text='User phone number'
        ),
        'created_at': serializers.DateTimeField(help_text='Account creation timestamp'),
        'is_active': serializers.BooleanField(help_text='Whether the user account is active'),
    }
)

# User Update Success Response Schema - with message
user_update_success_response_schema = inline_serializer(
    name='UserUpdateResponse',
    fields={
        'id': serializers.IntegerField(help_text='User ID'),
        'email': serializers.EmailField(
            required=False,
            allow_null=True,
            help_text='Updated email address'
        ),
        'phone': serializers.CharField(
            required=False,
            allow_null=True,
            max_length=20,
            help_text='Updated phone number'
        ),
        'created_at': serializers.DateTimeField(help_text='Account creation timestamp'),
        'is_active': serializers.BooleanField(help_text='Whether the user account is active'),
    }
)

# Validation Error Response Schema
validation_error_response_schema = inline_serializer(
    name='ValidationErrorResponse',
    fields={
        'email': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='Email validation errors'
        ),
        'phone': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='Phone validation errors'
        ),
        'non_field_errors': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='Non-field validation errors'
        ),
    }
)


# Helper function to get schema from serializer dynamically
def get_schema_from_serializer(serializer_class, name=None):
    """
    Dynamically generate an OpenAPI schema from a serializer class.
    
    Args:
        serializer_class: DRF Serializer class
        name: Optional name for the schema
        
    Returns:
        Inline serializer schema
    """
    if name is None:
        name = serializer_class.__name__
    
    # Get fields from serializer
    fields = {}
    if hasattr(serializer_class, '_declared_fields'):
        for field_name, field in serializer_class._declared_fields.items():
            fields[field_name] = field
    
    return inline_serializer(name=name, fields=fields)


# Extended schema serializers for better control and documentation
@extend_schema_serializer(
    examples=[
        {
            'email': 'user@example.com',
            'phone': '+1234567890',
        },
        {
            'email': 'newemail@example.com',
        },
        {
            'phone': '+9876543210',
        },
    ]
)
class UserUpdateRequestSchema(UserUpdateSerializer):
    """Schema for user profile update request - extends UserUpdateSerializer."""
    pass


@extend_schema_serializer()
class UserProfileResponseSchema(UserSerializer):
    """Schema for user profile response - extends UserSerializer."""
    pass
