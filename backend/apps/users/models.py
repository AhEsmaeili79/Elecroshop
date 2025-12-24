from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager that filters out soft-deleted users."""
    
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
    
    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        """Create and return a regular user with email or phone and password."""
        if not email and not phone:
            raise ValueError('User must have either an email or phone number.')
        
        # Normalize email only if provided and is a valid email
        if email:
            # Check if it's actually an email (contains @)
            if '@' in email:
                email = self.normalize_email(email)
            else:
                # If it doesn't contain @, it's not an email, set to None
                email = None
        else:
            email = None  # Explicitly set to None when not provided
        
        # Ensure phone is None if not provided
        if not phone:
            phone = None
        
        # Create user with explicit email=None if only phone provided
        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        # Reload from database to ensure correct values
        user.refresh_from_db()
        return user
    
    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        """Create and return a superuser with email or phone and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, phone=phone, password=password, **extra_fields)


class User(AbstractBaseUser):
    """Custom user model with email/phone authentication and soft delete."""
    
    email = models.EmailField(
        unique=True,
        null=True,
        blank=True,
        verbose_name='Email Address'
    )
    phone = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        verbose_name='Phone Number'
    )
    first_name = models.CharField(
        max_length=150,
        null=True,
        blank=True,
        verbose_name='First Name'
    )
    last_name = models.CharField(
        max_length=150,
        null=True,
        blank=True,
        verbose_name='Last Name'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False, verbose_name='Deleted')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Deleted At')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')
    
    objects = UserManager()
    all_objects = models.Manager()  # Manager to access all users including deleted
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __init__(self, *args, **kwargs):
        """Initialize user and ensure email is None if not a valid email."""
        super().__init__(*args, **kwargs)
        # If email is set but doesn't contain @, it's likely a phone number
        if self.email and '@' not in str(self.email):
            self.email = None
    
    # Override to handle None email
    def get_username(self):
        """Return email or phone as username."""
        return self.email or self.phone or str(self.id)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['is_deleted']),
        ]
    
    def __str__(self):
        return self.email or self.phone or f'User {self.id}'
    
    def clean(self):
        """Validate that at least one of email or phone is provided."""
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError('User must have either an email or phone number.')
    
    def save(self, *args, **kwargs):
        """Override save to validate and set deleted_at."""
        # Ensure email is None if it's not a valid email (e.g., if it was set to phone value)
        # Check if email exists and doesn't contain @ (not a valid email)
        if self.email:
            if '@' not in str(self.email):
                # If email doesn't contain @, it's likely a phone number, set to None
                self.email = None
        
        # Ensure at least one of email or phone is provided
        if not self.email and not self.phone:
            raise ValidationError('User must have either an email or phone number.')
        
        self.full_clean()
        if self.is_deleted and not self.deleted_at:
            self.deleted_at = timezone.now()
        elif not self.is_deleted:
            self.deleted_at = None
        super().save(*args, **kwargs)
    
    def has_perm(self, perm, obj=None):
        """Check if user has a specific permission."""
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        """Check if user has permissions for a specific app."""
        return self.is_superuser
    
    def soft_delete(self):
        """Soft delete the user."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

