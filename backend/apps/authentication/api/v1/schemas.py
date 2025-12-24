"""
Dynamic OpenAPI schemas for authentication endpoints.
These schemas are automatically generated based on serializer fields.
"""
from drf_spectacular.utils import extend_schema_serializer, inline_serializer
from rest_framework import serializers

from apps.authentication.api.v1.serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    TokenRefreshSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
)
from apps.users.api.v1.serializers import UserSerializer


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
register_request_schema = UserRegistrationSerializer
login_request_schema = UserLoginSerializer
token_refresh_request_schema = TokenRefreshSerializer
otp_request_schema = OTPRequestSerializer
otp_verify_schema = OTPVerifySerializer

# Shared tokens schema
tokens_schema = inline_serializer(
    name='JWTTokens',
    fields={
        'access': serializers.CharField(help_text='JWT access token'),
        'refresh': serializers.CharField(help_text='JWT refresh token'),
    }
)

# Response schemas
register_response_schema = inline_serializer(
    name='RegisterResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'user': UserSerializer(),
        'tokens': tokens_schema,
    }
)

login_response_schema = inline_serializer(
    name='LoginResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'user': UserSerializer(),
        'tokens': tokens_schema,
    }
)

logout_request_schema = inline_serializer(
    name='LogoutRequest',
    fields={'refresh': serializers.CharField(required=False, help_text='Refresh token to blacklist')}
)

logout_response_schema = inline_serializer(
    name='LogoutResponse',
    fields={'message': serializers.CharField(help_text='Success message')}
)

token_refresh_response_schema = inline_serializer(
    name='TokenRefreshResponse',
    fields={
        'access': serializers.CharField(help_text='New JWT access token'),
        'refresh': serializers.CharField(help_text='New JWT refresh token (if rotation enabled)'),
    }
)

# Logout response serializer for view
class LogoutResponseSerializer(serializers.Serializer):
    """Serializer for logout response."""
    message = serializers.CharField(help_text='Success message')


# OTP response schemas
otp_request_response_schema = inline_serializer(
    name='OTPRequestResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'identifier': serializers.CharField(help_text='Email or phone number where OTP was sent'),
        'purpose': serializers.ChoiceField(choices=['register', 'login'], help_text='Purpose of OTP request'),
        'otp_code': serializers.CharField(required=False, help_text='OTP code (development mode only)'),
        'dev_mode': serializers.BooleanField(required=False, help_text='Development mode indicator'),
    }
)

otp_request_error_schema = inline_serializer(
    name='OTPRequestError',
    fields={
        'error': serializers.CharField(help_text='Error message'),
        'identifier': serializers.CharField(required=False, help_text='Email or phone number that caused the error'),
    }
)

otp_verify_response_schema = inline_serializer(
    name='OTPVerifyResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'identifier': serializers.CharField(help_text='Email or phone number that was verified'),
        'purpose': serializers.ChoiceField(choices=['register', 'login'], help_text='Purpose of OTP verification'),
    }
)

otp_verify_error_schema = inline_serializer(
    name='OTPVerifyError',
    fields={
        'error': serializers.CharField(help_text='Error message'),
        'identifier': serializers.CharField(required=False, help_text='Email or phone number that caused the error'),
    }
)

