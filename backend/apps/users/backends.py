from apps.users.models import User
from apps.users.selectors import get_user_by_email_or_phone


class EmailOrPhoneBackend:
    """
    Custom authentication backend that allows users to login with email or phone.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        Authenticate user by email or phone and password.
        
        Args:
            request: HTTP request
            username: Email or phone number
            password: User password
            
        Returns:
            User instance if authenticated, None otherwise
        """
        if username is None or password is None:
            return None
        
        user = get_user_by_email_or_phone(username)
        
        if user and user.check_password(password) and user.is_active:
            return user
        
        return None
    
    def get_user(self, user_id):
        """
        Get user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            User instance or None
        """
        try:
            return User.objects.get(pk=user_id, is_deleted=False)
        except User.DoesNotExist:
            return None

