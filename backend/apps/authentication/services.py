from typing import Dict, Optional

from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User


def generate_jwt_tokens(user: User) -> Dict[str, str]:
    """
    Generate JWT access and refresh tokens for a user.
    
    Args:
        user: User instance
        
    Returns:
        Dictionary with 'access' and 'refresh' tokens
    """
    refresh = RefreshToken.for_user(user)
    
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def refresh_access_token(refresh_token: str) -> Optional[Dict[str, str]]:
    """
    Refresh access token using refresh token.
    
    Args:
        refresh_token: Refresh token string
        
    Returns:
        Dictionary with new 'access' and 'refresh' tokens, or None if invalid
    """
    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        return {
            'access': str(access_token),
            'refresh': str(refresh),
        }
    except Exception:
        return None

