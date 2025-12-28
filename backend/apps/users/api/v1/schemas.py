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


# Dynamic schema generation utility
def get_dynamic_schema_from_serializer(serializer_class, name=None):
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

    fields = {}
    if hasattr(serializer_class, '_declared_fields'):
        for field_name, field in serializer_class._declared_fields.items():
            fields[field_name] = field

    return inline_serializer(name=name, fields=fields)


# Request schemas - use serializers directly for automatic sync
user_profile_response_schema = UserSerializer
user_update_request_schema = UserUpdateSerializer
user_update_response_schema = UserSerializer
password_update_request_schema = PasswordUpdateSerializer

# Simple response schemas
password_update_response_schema = inline_serializer(
    name='PasswordUpdateResponse',
    fields={'message': serializers.CharField(help_text='Success message')}
)

# User-specific validation error schema
user_validation_error_response_schema = inline_serializer(
    name='UserValidationErrorResponse',
    fields={
        field_name: serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text=f'{field_name.replace("_", " ").title()} validation errors'
        )
        for field_name in [
            'email', 'phone', 'first_name', 'last_name',
            'current_password', 'new_password', 'new_password_confirm',
            'non_field_errors'
        ]
    }
)

# Enhanced request schema with examples
@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Update email and phone',
            value={'email': 'user@example.com', 'phone': '+1234567890'}
        ),
        OpenApiExample(
            'Update names',
            value={'first_name': 'John', 'last_name': 'Doe'}
        ),
        OpenApiExample(
            'Update email only',
            value={'email': 'newemail@example.com'}
        ),
        OpenApiExample(
            'Update phone only',
            value={'phone': '+9876543210'}
        ),
    ]
)
class UserUpdateRequestSchema(UserUpdateSerializer):
    """Enhanced schema for user profile update with examples."""
    pass


# View schema configurations for @extend_schema decorators
user_profile_view_schema = {
    'responses': {
        200: user_profile_response_schema,
        401: OpenApiResponse(description='Authentication required'),
    },
    'summary': 'Get user profile',
    'description': 'Retrieve the authenticated user\'s profile information',
    'tags': ['Users'],
    'operation_id': 'get_user_profile',
}

user_update_profile_view_schema = {
    'request': UserUpdateRequestSchema,  # Use enhanced schema with examples
    'responses': {
        200: user_update_response_schema,
        400: user_validation_error_response_schema,
        401: OpenApiResponse(description='Authentication required'),
    },
    'summary': 'Update user profile',
    'tags': ['Users'],
    'operation_id': 'update_user_profile',
}

password_update_view_schema = {
    'request': password_update_request_schema,
    'responses': {
        200: password_update_response_schema,
        400: user_validation_error_response_schema,
        401: OpenApiResponse(description='Authentication required'),
    },
    'summary': 'Update user password',
    'description': 'Update password with current password verification',
    'tags': ['Users'],
    'operation_id': 'update_user_password',
}
