"""Common validators shared across applications."""
from typing import Dict, Optional

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


def validate_password_strength(password: str) -> None:
    """
    Validate password strength using Django's password validators.
    
    Args:
        password: Password to validate
        
    Raises:
        serializers.ValidationError: If password doesn't meet strength requirements
    """
    try:
        validate_password(password)
    except Exception as e:
        raise serializers.ValidationError({'password': list(e.messages)})


def validate_passwords_match(password: str, password_confirm: str) -> None:
    """
    Validate that passwords match.
    
    Args:
        password: First password
        password_confirm: Password confirmation
        
    Raises:
        serializers.ValidationError: If passwords don't match
    """
    if password != password_confirm:
        raise serializers.ValidationError({'password': 'Passwords do not match.'})


def normalize_email_phone(email: Optional[str] = None, phone: Optional[str] = None) -> Dict[str, Optional[str]]:
    """
    Normalize email and phone values (empty strings to None).
    
    Args:
        email: Email address to normalize
        phone: Phone number to normalize
        
    Returns:
        Dictionary with normalized 'email' and 'phone' values
    """
    normalized_email = email if email and email.strip() else None
    normalized_phone = phone if phone and phone.strip() else None
    return {'email': normalized_email, 'phone': normalized_phone}
