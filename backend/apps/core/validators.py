"""Common validators shared across applications."""
import re
from typing import Dict, Optional, Tuple

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


def normalize_phone(phone: Optional[str]) -> Optional[str]:
    """
    Normalize phone number by removing whitespace and common formatting characters.
    
    Args:
        phone: Phone number to normalize
        
    Returns:
        Normalized phone number or None if empty
    """
    if not phone:
        return None
    
    # Strip whitespace
    phone = phone.strip()
    if not phone:
        return None
    
    # Remove common formatting characters but keep + for international format
    # Keep digits, +, and spaces (we'll remove spaces at the end)
    normalized = ''.join(c for c in phone if c.isdigit() or c == '+')
    
    # If it starts with +, keep it; otherwise ensure it's just digits
    if normalized.startswith('+'):
        return normalized
    return normalized if normalized else None


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
    normalized_phone = normalize_phone(phone)
    return {'email': normalized_email, 'phone': normalized_phone}


def detect_email_or_phone(identifier: str) -> Tuple[Optional[str], Optional[str], str]:
    """
    Detect if identifier is an email or phone number using regex.
    
    Args:
        identifier: Email address or phone number
        
    Returns:
        Tuple of (email, phone, type) where type is 'email' or 'phone'
        
    Raises:
        serializers.ValidationError: If identifier is neither valid email nor phone
    """
    if not identifier or not identifier.strip():
        raise serializers.ValidationError('Identifier cannot be empty.')
    
    identifier = identifier.strip()
    
    # Email regex pattern (RFC 5322 simplified)
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    # Phone regex pattern (supports international format with +, digits, spaces, dashes, parentheses)
    # Matches: +1234567890, 1234567890, (123) 456-7890, 123-456-7890, etc.
    phone_pattern = r'^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$'
    
    # Check if it's an email
    if re.match(email_pattern, identifier):
        normalized_email = identifier.lower()
        return normalized_email, None, 'email'
    
    # Check if it's a phone number
    # Remove common formatting characters for validation
    phone_digits = re.sub(r'[^\d+]', '', identifier)
    if len(phone_digits) >= 7 and len(phone_digits) <= 15:  # Reasonable phone length
        if re.match(phone_pattern, identifier):
            normalized_phone = normalize_phone(identifier)
            if normalized_phone:
                return None, normalized_phone, 'phone'
    
    # If neither matches, raise error
    raise serializers.ValidationError(
        'Invalid identifier. Please provide a valid email address or phone number.'
    )
