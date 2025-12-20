from typing import Optional

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils import timezone

from apps.users.models import User
from apps.users.selectors import (
    get_user_by_email_or_phone,
    user_exists_by_email,
    user_exists_by_phone,
)


def create_user(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    password: Optional[str] = None
) -> User:
    """
    Create a new user with email or phone and password.
    
    Args:
        email: User email address (optional)
        phone: User phone number (optional)
        password: User password (required)
        
    Returns:
        Created User instance
        
    Raises:
        ValidationError: If validation fails
    """
    # Validate that at least one of email or phone is provided
    if not email and not phone:
        raise ValidationError('User must have either an email or phone number.')
    
    # Validate password is provided
    if not password:
        raise ValidationError('Password is required.')
    
    # Check email uniqueness if provided
    if email:
        if user_exists_by_email(email):
            raise ValidationError({'email': 'A user with this email already exists.'})
    
    # Check phone uniqueness if provided
    if phone:
        if user_exists_by_phone(phone):
            raise ValidationError({'phone': 'A user with this phone number already exists.'})
    
    # Create user
    user = User.objects.create_user(
        email=email,
        phone=phone,
        password=password
    )
    
    return user


def soft_delete_user(user: User) -> User:
    """
    Soft delete a user.
    
    Args:
        user: User instance to soft delete
        
    Returns:
        Soft-deleted User instance
    """
    user.is_deleted = True
    user.deleted_at = timezone.now()
    user.save()
    return user


def authenticate_user(email_or_phone: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email or phone and password.
    
    Args:
        email_or_phone: User email address or phone number
        password: User password
        
    Returns:
        User instance if authentication successful, None otherwise
    """
    # Get user by email or phone
    user = get_user_by_email_or_phone(email_or_phone)
    
    if not user:
        return None
    
    # Check if user is active
    if not user.is_active:
        return None
    
    # Verify password
    if not user.check_password(password):
        return None
    
    return user

