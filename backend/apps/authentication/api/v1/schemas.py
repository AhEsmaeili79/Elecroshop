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


# Registration Request Schema - dynamically generated from UserRegistrationSerializer
# Using the serializer directly ensures it stays in sync with the actual serializer
register_request_schema = UserRegistrationSerializer

# Shared Tokens Schema - reused across multiple responses
tokens_schema = inline_serializer(
    name='JWTTokens',
    fields={
        'access': serializers.CharField(help_text='JWT access token'),
        'refresh': serializers.CharField(help_text='JWT refresh token'),
    }
)

# Registration Response Schema - dynamically generated from response structure
register_response_schema = inline_serializer(
    name='RegisterResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'user': UserSerializer(),
        'tokens': tokens_schema,
    }
)

# Login Request Schema - dynamically generated from UserLoginSerializer
# Using the serializer directly ensures it stays in sync with the actual serializer
login_request_schema = UserLoginSerializer

# Login Response Schema - dynamically generated from response structure
login_response_schema = inline_serializer(
    name='LoginResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'user': UserSerializer(),
        'tokens': tokens_schema,
    }
)

# Logout Request Schema
logout_request_schema = inline_serializer(
    name='LogoutRequest',
    fields={
        'refresh': serializers.CharField(
            required=False,
            help_text='Refresh token to blacklist (optional but recommended)',
        ),
    }
)

# Logout Response Schema
logout_response_schema = inline_serializer(
    name='LogoutResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
    }
)

# Logout Response Serializer (for LogoutView serializer_class attribute)
class LogoutResponseSerializer(serializers.Serializer):
    """Serializer for logout response."""
    message = serializers.CharField(help_text='Success message')

# Token Refresh Request Schema - dynamically generated from TokenRefreshSerializer
# Using the serializer directly ensures it stays in sync with the actual serializer
token_refresh_request_schema = TokenRefreshSerializer

# Token Refresh Response Schema
token_refresh_response_schema = inline_serializer(
    name='TokenRefreshResponse',
    fields={
        'access': serializers.CharField(help_text='New JWT access token'),
        'refresh': serializers.CharField(help_text='New JWT refresh token (if rotation enabled)'),
    }
)

# User Profile Response Schema - dynamically generated from UserSerializer
user_profile_response_schema = UserSerializer


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


# Alternative: Use extend_schema_serializer decorator for more control
@extend_schema_serializer()
class RegisterRequestSchema(UserRegistrationSerializer):
    """Schema for registration request - extends UserRegistrationSerializer."""
    pass


@extend_schema_serializer()
class LoginRequestSchema(UserLoginSerializer):
    """Schema for login request - extends UserLoginSerializer."""
    pass


@extend_schema_serializer()
class TokenRefreshRequestSchema(TokenRefreshSerializer):
    """Schema for token refresh request - extends TokenRefreshSerializer."""
    pass


# OTP Request Schema
otp_request_schema = OTPRequestSerializer

# OTP Request Success Response Schema
otp_request_response_schema = inline_serializer(
    name='OTPRequestResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'identifier': serializers.CharField(help_text='Email or phone number where OTP was sent'),
        'purpose': serializers.ChoiceField(
            choices=['register', 'login'],
            help_text='Purpose of OTP request'
        ),
        'otp_code': serializers.CharField(
            required=False,
            help_text='OTP code (only in development mode)'
        ),
        'dev_mode': serializers.BooleanField(
            required=False,
            help_text='Indicates if development mode is enabled'
        ),
    }
)

# OTP Request Error Response Schema
otp_request_error_schema = inline_serializer(
    name='OTPRequestError',
    fields={
        'error': serializers.CharField(help_text='Error message'),
        'identifier': serializers.CharField(
            required=False,
            help_text='Email or phone number that caused the error'
        ),
    }
)

# OTP Verify Schema
otp_verify_schema = OTPVerifySerializer

# OTP Verify Success Response Schema
otp_verify_response_schema = inline_serializer(
    name='OTPVerifyResponse',
    fields={
        'message': serializers.CharField(help_text='Success message'),
        'identifier': serializers.CharField(help_text='Email or phone number that was verified'),
        'purpose': serializers.ChoiceField(
            choices=['register', 'login'],
            help_text='Purpose of OTP verification'
        ),
    }
)

# OTP Verify Error Response Schema
otp_verify_error_schema = inline_serializer(
    name='OTPVerifyError',
    fields={
        'error': serializers.CharField(help_text='Error message'),
        'identifier': serializers.CharField(
            required=False,
            help_text='Email or phone number that caused the error'
        ),
    }
)

