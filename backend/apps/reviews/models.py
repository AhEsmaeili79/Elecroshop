from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import ProductOffer, Color
from apps.core.models import BaseModel

User = settings.AUTH_USER_MODEL


class Review(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(
        'product.Product', on_delete=models.CASCADE, related_name='reviews'
    )
    title = models.CharField(max_length=50, blank=True, default='')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.product.name}: {self.comment[:50]}..."


class Wishlist(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    offer = models.ForeignKey(
        ProductOffer, on_delete=models.CASCADE, related_name='wishlisted'
    )
    color = models.ForeignKey(
        Color,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text="Optional: the specific color selected for this offer"
    )
    specs_snapshot = models.JSONField(blank=True, default=dict)

    class Meta:
        unique_together = ('user', 'offer', 'color')
        ordering = ['-created_at']

    def __str__(self):
        desc = f"{self.offer.product.name} - {self.offer.seller}"
        if self.color:
            desc += f" - {self.color.color_hex}"
        return f"{self.user} → {desc}"
