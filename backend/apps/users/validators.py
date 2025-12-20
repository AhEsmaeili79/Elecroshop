"""Validators for users app."""
from typing import Optional

from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.core.validators import normalize_phone
from apps.users.selectors import user_exists_by_email, user_exists_by_phone


def validate_email_for_update(
    value: Optional[str],
    instance=None
) -> Optional[str]:
    """
    Validate email format and uniqueness for user update.
    
    Args:
        value: Email address to validate
        instance: User instance being updated (optional)
        
    Returns:
        Normalized email address or None
        
    Raises:
        serializers.ValidationError: If validation fails
    """
    if value is None:
        return None
    
    # Normalize empty string to None
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
    
    # Validate email format using Django's validator
    if '@' not in value:
        raise serializers.ValidationError('Enter a valid email address.')
    
    try:
        validate_email(value)
    except DjangoValidationError:
        raise serializers.ValidationError('Enter a valid email address.')
    
    # Normalize email to lowercase (consistent with UserManager)
    value = value.lower()
    
    # If user is keeping the same email, allow it
    if instance and instance.email == value:
        return value
    
    # Check if another user with this email exists
    if user_exists_by_email(value):
        raise serializers.ValidationError('A user with this email already exists.')
    
    return value


def validate_phone_for_update(
    value: Optional[str],
    instance=None
) -> Optional[str]:
    """
    Validate phone uniqueness for user update.
    
    Args:
        value: Phone number to validate
        instance: User instance being updated (optional)
        
    Returns:
        Normalized phone number or None
        
    Raises:
        serializers.ValidationError: If validation fails
    """
    if value is None:
        return None
    
    # Normalize phone number
    normalized_phone = normalize_phone(value)
    if not normalized_phone:
        return None
    
    # If user is keeping the same phone, allow it
    if instance and instance.phone == normalized_phone:
        return normalized_phone
    
    # Check if another user with this phone exists
    if user_exists_by_phone(normalized_phone):
        raise serializers.ValidationError('A user with this phone number already exists.')
    
    return normalized_phone


def validate_email_or_phone_provided_for_update(
    email: Optional[str],
    phone: Optional[str],
    instance=None
) -> None:
    """
    Ensure at least one of email or phone is provided for user update.
    
    Args:
        email: Email address (can be from attrs or instance)
        phone: Phone number (can be from attrs or instance)
        instance: User instance being updated (optional)
        
    Raises:
        serializers.ValidationError: If both email and phone are None/empty
    """
    # Normalize None values (handle empty strings that were converted to None)
    email = email if email else None
    phone = phone if phone else None
    
    # If both are being set to None/empty, raise error
    if not email and not phone:
        raise serializers.ValidationError('User must have either an email or phone number.')


def validate_current_password(user, password: str) -> None:
    """
    Validate that current password is correct.
    
    Args:
        user: User instance
        password: Password to validate
        
    Raises:
        serializers.ValidationError: If password is incorrect
    """
    if not user.check_password(password):
        raise serializers.ValidationError('Current password is incorrect.')


def validate_new_password_different(user, new_password: str) -> None:
    """
    Validate that new password is different from current password.
    
    Args:
        user: User instance
        new_password: New password to validate
        
    Raises:
        serializers.ValidationError: If new password is same as current
    """
    if user.check_password(new_password):
        raise serializers.ValidationError(
            {'new_password': 'New password must be different from current password.'}
        )
