from django.db import transaction
from rest_framework import serializers

from apps.core.validators import validate_password_strength, validate_passwords_match
from apps.users.models import User
from apps.users.selectors import user_exists_by_email, user_exists_by_phone
from apps.users.validators import (
    validate_current_password,
    validate_email_for_update,
    validate_email_or_phone_provided_for_update,
    validate_new_password_different,
    validate_phone_for_update,
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'first_name', 'last_name', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['email', 'phone', 'first_name', 'last_name']
    
    def validate_email(self, value):
        """Validate email format and uniqueness if provided."""
        return validate_email_for_update(value, instance=self.instance)
    
    def validate_phone(self, value):
        """Validate phone uniqueness if provided."""
        return validate_phone_for_update(value, instance=self.instance)
    
    def validate(self, attrs):
        """Ensure at least one of email or phone is provided."""
        # Get email: use attrs value if key exists, otherwise use instance value
        if 'email' in attrs:
            email = attrs['email']
        else:
            email = self.instance.email if self.instance else None
        
        # Get phone: use attrs value if key exists, otherwise use instance value
        if 'phone' in attrs:
            phone = attrs['phone']
        else:
            phone = self.instance.phone if self.instance else None
        
        # Validate using validator function
        validate_email_or_phone_provided_for_update(email, phone, instance=self.instance)
        
        return attrs
    
    @transaction.atomic
    def update(self, instance, validated_data):
        """Update user instance with transaction protection."""
        # Lock the instance to prevent race conditions
        locked_instance = User.objects.select_for_update().get(pk=instance.pk)
        
        # Double-check uniqueness after acquiring lock
        if 'email' in validated_data and validated_data['email']:
            email = validated_data['email']
            if locked_instance.email != email and user_exists_by_email(email):
                raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        
        if 'phone' in validated_data and validated_data['phone']:
            phone = validated_data['phone']
            if locked_instance.phone != phone and user_exists_by_phone(phone):
                raise serializers.ValidationError({'phone': 'A user with this phone number already exists.'})
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(locked_instance, attr, value)
        
        locked_instance.save()
        return locked_instance


class PasswordUpdateSerializer(serializers.Serializer):
    """Serializer for updating user password."""
    
    current_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Current password'
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='New password'
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='New password confirmation'
    )
    
    def validate_current_password(self, value):
        """Validate that current password is correct."""
        user = self.context['request'].user
        validate_current_password(user, value)
        return value
    
    def validate(self, attrs):
        """Validate password change data."""
        current_password = attrs.get('current_password')
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')
        user = self.context['request'].user
        
        # Validate passwords match
        validate_passwords_match(new_password, new_password_confirm)
        
        # Validate password strength
        validate_password_strength(new_password)
        
        # Ensure new password is different from current password
        validate_new_password_different(user, new_password)
        
        return attrs
    
    @transaction.atomic
    def save(self):
        """Update user password."""
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        
        # Lock the user instance to prevent race conditions
        locked_user = User.objects.select_for_update().get(pk=user.pk)
        locked_user.set_password(new_password)
        locked_user.save()
        
        return locked_user

