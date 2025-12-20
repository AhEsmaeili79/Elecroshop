from typing import Optional

from django.core.exceptions import ObjectDoesNotExist

from apps.users.models import User


def get_user_by_email(email: str) -> Optional[User]:
    """
    Get active user by email (excludes soft-deleted users).
    
    Args:
        email: User email address
        
    Returns:
        User instance or None if not found
    """
    try:
        return User.objects.get(email=email, is_deleted=False)
    except (User.DoesNotExist, ValueError):
        return None


def get_user_by_phone(phone: str) -> Optional[User]:
    """
    Get active user by phone (excludes soft-deleted users).
    
    Args:
        phone: User phone number
        
    Returns:
        User instance or None if not found
    """
    try:
        return User.objects.get(phone=phone, is_deleted=False)
    except (User.DoesNotExist, ValueError):
        return None


def get_user_by_email_or_phone(identifier: str) -> Optional[User]:
    """
    Get active user by email or phone (excludes soft-deleted users).
    Tries email first, then phone.
    
    Args:
        identifier: Email address or phone number
        
    Returns:
        User instance or None if not found
    """
    # Try email first
    user = get_user_by_email(identifier)
    if user:
        return user
    
    # Try phone
    return get_user_by_phone(identifier)


def user_exists_by_email(email: str) -> bool:
    """
    Check if user with email exists (excludes soft-deleted users).
    
    Args:
        email: Email address to check
        
    Returns:
        True if user exists, False otherwise
    """
    return User.objects.filter(email=email, is_deleted=False).exists()


def user_exists_by_phone(phone: str) -> bool:
    """
    Check if user with phone exists (excludes soft-deleted users).
    
    Args:
        phone: Phone number to check
        
    Returns:
        True if user exists, False otherwise
    """
    return User.objects.filter(phone=phone, is_deleted=False).exists()


def get_user_by_id(user_id: int) -> Optional[User]:
    """
    Get active user by ID (excludes soft-deleted users).
    
    Args:
        user_id: User ID
        
    Returns:
        User instance or None if not found
    """
    try:
        return User.objects.get(id=user_id, is_deleted=False)
    except (User.DoesNotExist, ValueError):
        return None

