from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from django.utils.text import slugify

from apps.core.models import BaseModel
from apps.core.validators import detect_email_or_phone


class UserManager(BaseUserManager):
    """Custom user manager that filters out soft-deleted users."""

    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

    def _create_user(self, identifier, password=None, **extra_fields):
        """Create and return a user with an identifier (email or phone) and password."""
        if not identifier:
            raise ValueError('User must have either an email or phone number.')

        email, phone, _ = detect_email_or_phone(identifier)

        user = self.model(email=email, phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        """Create and return a regular user with email or phone and password."""
        identifier = email or phone
        return self._create_user(identifier, password, **extra_fields)

    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        """Create and return a superuser with email or phone and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email=email, phone=phone, password=password, **extra_fields)


class User(BaseModel, AbstractBaseUser):
    """Custom user model with email/phone authentication."""

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
    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user should be treated as active'
    )
    is_staff = models.BooleanField(
        default=False,
        help_text='Designates whether the user can log into admin site'
    )
    is_superuser = models.BooleanField(
        default=False,
        help_text='Designates that this user has all permissions without explicitly assigning them'
    )

    objects = UserManager()
    all_objects = models.Manager()  # Manager to access all users including deleted

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

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

    def get_username(self):
        """Return email or phone as username."""
        return self.email or self.phone or str(self.id)

    def clean(self):
        """Validate that at least one of email or phone is provided."""
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError('User must have either an email or phone number.')

    def has_perm(self, perm, obj=None):
        """Check if user has a specific permission."""
        return self.is_superuser

    def has_module_perms(self, app_label):
        """Check if user has permissions for a specific app."""
        return self.is_superuser

class Seller(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile"
    )

    slug = models.SlugField(unique=True, blank=True)
    shop_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.shop_name)
            slug = base_slug
            counter = 1
            while Seller.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)
