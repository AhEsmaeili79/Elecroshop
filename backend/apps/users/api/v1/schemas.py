"""
Dynamic OpenAPI schemas for users endpoints.
These schemas are automatically generated based on serializer fields.
"""
from drf_spectacular.utils import extend_schema_serializer, inline_serializer, OpenApiExample, OpenApiResponse
from rest_framework import serializers

from apps.users.api.v1.serializers import (
    PasswordUpdateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


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

# Password Update Request Schema - dynamically generated from PasswordUpdateSerializer
password_update_request_schema = PasswordUpdateSerializer

# Password Update Response Schema
password_update_response_schema = inline_serializer(
    name='PasswordUpdateResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
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
        'current_password': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='Current password validation errors'
        ),
        'new_password': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='New password validation errors'
        ),
        'new_password_confirm': serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text='New password confirmation validation errors'
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
        OpenApiExample(
            'Update with email and phone',
            value={
                'email': 'user@example.com',
                'phone': '+1234567890',
            },
        ),
        OpenApiExample(
            'Update email only',
            value={
                'email': 'newemail@example.com',
            },
        ),
        OpenApiExample(
            'Update phone only',
            value={
                'phone': '+9876543210',
            },
        ),
    ]
)
class UserUpdateRequestSchema(UserUpdateSerializer):
    """Schema for user profile update request - extends UserUpdateSerializer."""
    pass


@extend_schema_serializer()
class UserProfileResponseSchema(UserSerializer):
    """Schema for user profile response - extends UserSerializer."""
    pass


# Schema configurations for views
# These can be unpacked in @extend_schema decorators

# User Profile View Schema
user_profile_view_schema = {
    'responses': {
        200: user_profile_response_schema,
        401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
    },
    'summary': 'Get user profile',
    'description': 'Retrieve the profile information of the currently authenticated user. Returns user details including ID, email, phone number, creation date, and active status.',
    'tags': ['Users'],
    'operation_id': 'get_user_profile',
}

# User Update Profile View Examples
user_update_profile_examples = [
    OpenApiExample(
        'Update with email and phone',
        value={
            'email': 'test@example.com',
            'phone': '+1234567890',
        },
    ),
    OpenApiExample(
        'Update email only',
        value={
            'email': 'updated@example.com',
        },
    ),
    OpenApiExample(
        'Update phone only',
        value={
            'phone': '+989123456789',
        },
    ),
]

# User Update Profile View Schema
user_update_profile_view_schema = {
    'request': user_update_request_schema,
    'responses': {
        200: user_update_response_schema,
        400: validation_error_response_schema,
        401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
    },
    'summary': 'Update user profile',
    'tags': ['Users'],
    'operation_id': 'update_user_profile',
    'examples': user_update_profile_examples,
}

# Password Update View Schema
password_update_view_schema = {
    'request': password_update_request_schema,
    'responses': {
        200: password_update_response_schema,
        400: validation_error_response_schema,
        401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
    },
    'summary': 'Update user password',
    'description': 'Update the password for the currently authenticated user. Requires current password verification.',
    'tags': ['Users'],
    'operation_id': 'update_user_password',
}
