from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from apps.authentication.services import generate_jwt_tokens
from apps.authentication.validators import (
    validate_registration_data,
    validate_user_credentials,
)
from apps.core.validators import normalize_email_phone
from apps.users.api.v1.serializers import UserSerializer
from apps.users.services import create_user


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration with optional OTP."""
    
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    phone = serializers.CharField(
        max_length=20,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True,
        style={'input_type': 'password'}
    )
    otp_code = serializers.CharField(
        max_length=6,
        required=False,
        allow_null=True,
        allow_blank=True,
        help_text='OTP code for registration (required if password not provided)'
    )
    
    def validate(self, attrs):
        """Validate registration data using validator layers."""
        email = attrs.get('email')
        phone = attrs.get('phone')
        password = attrs.get('password')
        otp_code = attrs.get('otp_code')
        
        # Normalize email and phone
        normalized = normalize_email_phone(email, phone)
        email = normalized['email']
        phone = normalized['phone']
        
        # At least one of email or phone must be provided
        if not email and not phone:
            raise serializers.ValidationError(
                'User must have either an email or phone number.'
            )
        
        # Either password or OTP must be provided
        if not password and not otp_code:
            raise serializers.ValidationError(
                'Either password or OTP code must be provided.'
            )
        
        # If password is provided, validate it
        if password:
            validated_data = validate_registration_data(
                email=email,
                phone=phone,
                password=password
            )
            attrs.update(validated_data)
        else:
            # If OTP is provided, validate email/phone uniqueness but skip password validation
            from apps.authentication.validators import (
                validate_email_uniqueness,
                validate_phone_uniqueness,
            )
            if email:
                validate_email_uniqueness(email)
            if phone:
                validate_phone_uniqueness(phone)
            
            attrs['email'] = email
            attrs['phone'] = phone
        
        return attrs
    
    def create(self, validated_data):
        """Create a new user and return tokens."""
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        password = validated_data.get('password')
        
        # If password is provided, create user with password
        if password:
            user = create_user(email=email, phone=phone, password=password)
        else:
            # If no password, create user without password (will be set later or use OTP)
            # For OTP-only registration, we'll create user with a temporary password
            # In production, you might want to require password reset after OTP verification
            from django.utils.crypto import get_random_string
            temp_password = get_random_string(32)
            user = create_user(email=email, phone=phone, password=temp_password)
        
        tokens = generate_jwt_tokens(user)
        
        # Add tokens to the user object for response
        user.tokens = tokens
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login with optional OTP."""
    
    email_or_phone = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True,
        style={'input_type': 'password'},
        help_text='Password for login (optional if OTP is provided)'
    )
    otp_code = serializers.CharField(
        max_length=6,
        required=False,
        allow_null=True,
        allow_blank=True,
        help_text='OTP code for login (optional, alternative to password)'
    )
    
    def validate(self, attrs):
        """Authenticate user using validator layer."""
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')
        otp_code = attrs.get('otp_code')
        
        # Either password or OTP must be provided
        if not password and not otp_code:
            raise serializers.ValidationError(
                'Either password or OTP code must be provided.'
            )
        
        # If password is provided, use traditional authentication
        if password:
            validated_data = validate_user_credentials(email_or_phone, password)
            attrs.update(validated_data)
        else:
            # OTP verification will be done in the view
            # Just validate that user exists
            from apps.users.selectors import get_user_by_email_or_phone
            user = get_user_by_email_or_phone(email_or_phone)
            if not user:
                raise serializers.ValidationError(
                    'Invalid credentials. Please check your email/phone.'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is inactive.'
                )
            attrs['user'] = user
        
        return attrs


class OTPRequestSerializer(serializers.Serializer):
    """Serializer for requesting OTP with single identifier field."""
    
    identifier = serializers.CharField(
        required=True,
        help_text='Email address or phone number'
    )
    purpose = serializers.ChoiceField(
        choices=['register', 'login'],
        required=True,
        help_text='Purpose of OTP: register or login'
    )
    
    def validate(self, attrs):
        """Detect and normalize email or phone from identifier."""
        original_identifier = attrs.get('identifier')
        
        # Detect if identifier is email or phone
        from apps.core.validators import detect_email_or_phone
        email, phone, identifier_type = detect_email_or_phone(original_identifier)
        
        # Store normalized values
        attrs['email'] = email
        attrs['phone'] = phone
        attrs['normalized_identifier'] = email or phone  # Normalized for Redis
        attrs['original_identifier'] = original_identifier  # Original for response
        attrs['identifier_type'] = identifier_type
        
        return attrs


class OTPVerifySerializer(serializers.Serializer):
    """Serializer for verifying OTP with single identifier field."""
    
    identifier = serializers.CharField(
        required=True,
        help_text='Email address or phone number'
    )
    otp_code = serializers.CharField(
        max_length=6,
        min_length=6,
        required=True,
        help_text='6-digit OTP code to verify'
    )
    purpose = serializers.ChoiceField(
        choices=['register', 'login'],
        required=True,
        help_text='Purpose of OTP: register or login'
    )
    
    def validate(self, attrs):
        """Detect and normalize email or phone from identifier."""
        original_identifier = attrs.get('identifier')
        
        # Detect if identifier is email or phone
        from apps.core.validators import detect_email_or_phone
        email, phone, identifier_type = detect_email_or_phone(original_identifier)
        
        # Store normalized values
        attrs['email'] = email
        attrs['phone'] = phone
        attrs['normalized_identifier'] = email or phone  # Normalized for Redis
        attrs['original_identifier'] = original_identifier  # Original for response
        attrs['identifier_type'] = identifier_type
        
        return attrs


class TokenRefreshSerializer(TokenRefreshSerializer):
    """Serializer for refreshing access token."""
    pass

