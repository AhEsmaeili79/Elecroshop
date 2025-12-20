"""Validators for authentication app."""
from typing import Optional

from rest_framework import serializers

from apps.core.validators import normalize_email_phone, validate_password_strength, validate_passwords_match
from apps.users.selectors import user_exists_by_email, user_exists_by_phone
from apps.users.services import authenticate_user


def validate_email_or_phone_provided(email: Optional[str] = None, phone: Optional[str] = None) -> None:
    """
    Validate that at least one of email or phone is provided.
    
    Args:
        email: Email address
        phone: Phone number
        
    Raises:
        serializers.ValidationError: If neither email nor phone is provided
    """
    normalized = normalize_email_phone(email, phone)
    if not normalized['email'] and not normalized['phone']:
        raise serializers.ValidationError(
            'Either email or phone number must be provided.'
        )


def validate_email_uniqueness(email: Optional[str]) -> None:
    """
    Validate that email is unique if provided.
    
    Args:
        email: Email address to check
        
    Raises:
        serializers.ValidationError: If email already exists
    """
    if email and user_exists_by_email(email):
        raise serializers.ValidationError({'email': 'A user with this email already exists.'})


def validate_phone_uniqueness(phone: Optional[str]) -> None:
    """
    Validate that phone is unique if provided.
    
    Args:
        phone: Phone number to check
        
    Raises:
        serializers.ValidationError: If phone already exists
    """
    if phone and user_exists_by_phone(phone):
        raise serializers.ValidationError(
            {'phone': 'A user with this phone number already exists.'}
        )


def validate_user_credentials(email_or_phone: str, password: str) -> dict:
    """
    Validate user credentials for login.
    
    Args:
        email_or_phone: Email address or phone number
        password: User password
        
    Returns:
        Dictionary containing 'user' key with authenticated user
        
    Raises:
        serializers.ValidationError: If credentials are invalid
    """
    user = authenticate_user(email_or_phone, password)
    
    if not user:
        raise serializers.ValidationError(
            'Invalid credentials. Please check your email/phone and password.'
        )
    
    return {'user': user}


def validate_registration_data(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    password: Optional[str] = None,
    password_confirm: Optional[str] = None
) -> dict:
    """
    Validate all registration data.
    
    Args:
        email: Email address
        phone: Phone number
        password: Password
        password_confirm: Password confirmation
        
    Returns:
        Dictionary with normalized and validated data
        
    Raises:
        serializers.ValidationError: If validation fails
    """
    # Normalize email and phone
    normalized = normalize_email_phone(email, phone)
    normalized_email = normalized['email']
    normalized_phone = normalized['phone']
    
    # Validate that at least one of email or phone is provided
    validate_email_or_phone_provided(normalized_email, normalized_phone)
    
    # Validate email uniqueness if provided
    if normalized_email:
        validate_email_uniqueness(normalized_email)
    
    # Validate phone uniqueness if provided
    if normalized_phone:
        validate_phone_uniqueness(normalized_phone)
    
    # Validate passwords match
    if password and password_confirm:
        validate_passwords_match(password, password_confirm)
    
    # Validate password strength
    if password:
        validate_password_strength(password)
    
    return {
        'email': normalized_email,
        'phone': normalized_phone,
        'password': password,
    }
