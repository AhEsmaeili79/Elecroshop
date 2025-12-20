from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from apps.authentication.services import generate_jwt_tokens
from apps.users.models import User
from apps.users.selectors import user_exists_by_email, user_exists_by_phone
from apps.users.services import authenticate_user, create_user


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
        """Validate that at least one of email or phone is provided and passwords match."""
        email = attrs.get('email')
        phone = attrs.get('phone')
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        # Check that at least one of email or phone is provided
        if not email and not phone:
            raise serializers.ValidationError(
                'Either email or phone number must be provided.'
            )
        
        # Normalize empty strings to None
        if email == '':
            email = None
        if phone == '':
            phone = None
        
        # Check email uniqueness if provided
        if email:
            if user_exists_by_email(email):
                raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        
        # Check phone uniqueness if provided
        if phone:
            if user_exists_by_phone(phone):
                raise serializers.ValidationError(
                    {'phone': 'A user with this phone number already exists.'}
                )
        
        # Check passwords match
        if password != password_confirm:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        # Validate password strength using Django validators
        from django.contrib.auth.password_validation import validate_password
        try:
            validate_password(password)
        except Exception as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        
        # Explicitly set email to None if not provided or empty
        attrs['email'] = email if email and email.strip() else None
        attrs['phone'] = phone if phone and phone.strip() else None
        return attrs
    
    def create(self, validated_data):
        """Create a new user and return tokens."""
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        password = validated_data.get('password')
        
        # Explicitly ensure email is None if not provided
        if not email or (email and '@' not in email):
            email = None
        
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
        """Authenticate user and return user instance."""
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')
        
        user = authenticate_user(email_or_phone, password)
        
        if not user:
            raise serializers.ValidationError(
                'Invalid credentials. Please check your email/phone and password.'
            )
        
        attrs['user'] = user
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

