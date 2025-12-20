from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from apps.authentication.services import generate_jwt_tokens
from apps.authentication.validators import (
    validate_registration_data,
    validate_user_credentials,
)
from apps.users.models import User
from apps.users.services import create_user


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration."""
    
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    phone = serializers.CharField(
        max_length=20,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Validate registration data using validator layers."""
        email = attrs.get('email')
        phone = attrs.get('phone')
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        # Use validator layer for all registration validation
        validated_data = validate_registration_data(
            email=email,
            phone=phone,
            password=password,
            password_confirm=password_confirm
        )
        
        # Update attrs with normalized and validated data
        attrs.update(validated_data)
        # Remove password_confirm as it's not needed after validation
        attrs.pop('password_confirm', None)
        return attrs
    
    def create(self, validated_data):
        """Create a new user and return tokens."""
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        password = validated_data.get('password')
        
        # Data is already normalized and validated by validator layer
        user = create_user(email=email, phone=phone, password=password)
        tokens = generate_jwt_tokens(user)
        
        # Add tokens to the user object for response
        user.tokens = tokens
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email_or_phone = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Authenticate user using validator layer."""
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')
        
        # Use validator layer for credential validation
        validated_data = validate_user_credentials(email_or_phone, password)
        attrs.update(validated_data)
        return attrs


class TokenRefreshSerializer(TokenRefreshSerializer):
    """Serializer for refreshing access token."""
    pass


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']

