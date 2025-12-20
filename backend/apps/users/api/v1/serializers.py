from rest_framework import serializers

from apps.users.models import User
from apps.users.selectors import user_exists_by_email, user_exists_by_phone


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['email', 'phone']
    
    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            # Normalize empty string to None
            value = value.strip() if isinstance(value, str) else value
            if not value:
                return None
            
            # If user is keeping the same email, allow it
            if self.instance and self.instance.email == value:
                return value
            
            # Check if another user with this email exists
            if user_exists_by_email(value):
                raise serializers.ValidationError('A user with this email already exists.')
        return value
    
    def validate_phone(self, value):
        """Validate phone uniqueness if provided."""
        if value:
            # Normalize empty string to None
            value = value.strip() if isinstance(value, str) else value
            if not value:
                return None
            
            # If user is keeping the same phone, allow it
            if self.instance and self.instance.phone == value:
                return value
            
            # Check if another user with this phone exists
            if user_exists_by_phone(value):
                raise serializers.ValidationError('A user with this phone number already exists.')
        return value
    
    def validate(self, attrs):
        """Ensure at least one of email or phone is provided."""
        email = attrs.get('email', self.instance.email if self.instance else None)
        phone = attrs.get('phone', self.instance.phone if self.instance else None)
        
        # If both are being set to None/empty, raise error
        if not email and not phone:
            raise serializers.ValidationError('User must have either an email or phone number.')
        
        return attrs
    
    def update(self, instance, validated_data):
        """Update user instance."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

