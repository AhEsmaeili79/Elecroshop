"""Common models and mixins for shared functionality across applications."""
import uuid
from django.db import models
from django.utils import timezone


class TimestampedModel(models.Model):
    """Abstract base model with automatic timestamp fields."""

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At',
        help_text='When this record was created'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='When this record was last updated'
    )

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """Abstract base model with soft delete functionality."""

    is_deleted = models.BooleanField(
        default=False,
        verbose_name='Deleted',
        help_text='Whether this record is soft deleted'
    )
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Deleted At',
        help_text='When this record was deleted (if soft deleted)'
    )

    objects = models.Manager()  # Default manager (includes deleted records)
    active_objects = None  # Will be overridden by custom managers

    class Meta:
        abstract = True

    def soft_delete(self):
        """Soft delete this instance."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])

    def restore(self):
        """Restore a soft deleted instance."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])

    @property
    def is_active(self):
        """Check if instance is active (not soft deleted)."""
        return not self.is_deleted


class SoftDeleteManager(models.Manager):
    """Manager that filters out soft deleted records by default."""

    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class BaseModel(TimestampedModel, SoftDeleteModel):
    """Combined base model with timestamps, soft delete functionality, and UUID primary key."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name='ID',
        help_text='Unique identifier for this record'
    )

    active_objects = SoftDeleteManager()

    class Meta:
        abstract = True
