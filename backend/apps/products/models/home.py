from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import BaseModel
from .product import Product


class HeroBanner(BaseModel):
    """
    Hero banner/carousel slides for homepage hero section
    """
    title = models.CharField(max_length=255, help_text="Main headline for the banner")
    subtitle = models.CharField(
        max_length=100,
        blank=True,
        help_text="Small text above title (e.g., '30% Sale Off')"
    )
    description = models.TextField(
        blank=True,
        help_text="Banner description text"
    )

    # Discount information
    discount_percentage = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        blank=True,
        null=True,
        help_text="Discount percentage (1-100)"
    )
    discount_text = models.CharField(
        max_length=50,
        blank=True,
        help_text="Discount display text (e.g., 'UP TO 30% OFF')"
    )

    # Product association
    featured_product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='hero_banners',
        help_text="Product to feature in this banner"
    )

    # Images
    background_image = models.ImageField(
        upload_to="hero/backgrounds/%Y/%m/%d/",
        blank=True,
        help_text="Background image for the banner"
    )
    product_image = models.ImageField(
        upload_to="hero/products/%Y/%m/%d/",
        blank=True,
        help_text="Product image to display"
    )

    # Call-to-action
    button_text = models.CharField(
        max_length=50,
        default="Shop Now",
        help_text="Button text"
    )
    button_link = models.URLField(
        blank=True,
        help_text="Button link URL"
    )

    # Display settings
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in carousel"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this banner is active"
    )

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Hero Banner"
        verbose_name_plural = "Hero Banners"

    def __str__(self):
        return self.title


class PromoBanner(BaseModel):
    """
    Promotional banners for different layouts and offers
    """
    BANNER_TYPES = [
        ('big', 'Big Banner'),
        ('small_left', 'Small Banner (Left Aligned)'),
        ('small_right', 'Small Banner (Right Aligned)'),
    ]

    title = models.CharField(max_length=255, help_text="Banner title")
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        help_text="Banner subtitle"
    )
    description = models.TextField(
        blank=True,
        help_text="Banner description"
    )

    banner_type = models.CharField(
        max_length=20,
        choices=BANNER_TYPES,
        default='big',
        help_text="Banner layout type"
    )

    # Product association
    featured_product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='promo_banners',
        help_text="Product to feature in this banner"
    )

    # Discount information
    discount_percentage = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        blank=True,
        null=True,
        help_text="Discount percentage"
    )
    discount_type = models.CharField(
        max_length=50,
        blank=True,
        help_text="Discount type (e.g., 'Flat 20% off', 'UP TO 40% off')"
    )

    # Images
    background_image = models.ImageField(
        upload_to="promo/backgrounds/%Y/%m/%d/",
        blank=True,
        help_text="Background image for the banner"
    )
    product_image = models.ImageField(
        upload_to="promo/products/%Y/%m/%d/",
        blank=True,
        help_text="Product image to display"
    )

    # Styling
    background_color = models.CharField(
        max_length=7,
        blank=True,
        help_text="Background color (hex code, e.g., #FFFFFF)"
    )
    gradient_from = models.CharField(
        max_length=50,
        blank=True,
        help_text="Gradient start color (Tailwind class)"
    )
    gradient_to = models.CharField(
        max_length=50,
        blank=True,
        help_text="Gradient end color (Tailwind class)"
    )

    # Call-to-action
    button_text = models.CharField(
        max_length=50,
        default="Shop Now",
        help_text="Button text"
    )
    button_link = models.URLField(
        blank=True,
        help_text="Button link URL"
    )

    # Display settings
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this banner is active"
    )

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Promo Banner"
        verbose_name_plural = "Promo Banners"

    def __str__(self):
        return f"{self.get_banner_type_display()}: {self.title}"


class CountdownOffer(BaseModel):
    """
    Limited-time offers with countdown timer
    """
    title = models.CharField(max_length=255, help_text="Offer title")
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        help_text="Offer subtitle"
    )
    description = models.TextField(
        blank=True,
        help_text="Offer description"
    )

    # Countdown settings
    deadline = models.DateTimeField(
        help_text="Countdown deadline"
    )
    countdown_label = models.CharField(
        max_length=100,
        default="Don't Miss!!",
        help_text="Label above the title"
    )

    # Product association
    featured_product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='countdown_offers',
        help_text="Product to feature in this offer"
    )

    # Images
    background_image = models.ImageField(
        upload_to="countdown/backgrounds/%Y/%m/%d/",
        blank=True,
        help_text="Background image"
    )
    product_image = models.ImageField(
        upload_to="countdown/products/%Y/%m/%d/",
        blank=True,
        help_text="Product image"
    )

    # Styling
    background_color = models.CharField(
        max_length=7,
        default="#D0E9F3",
        help_text="Background color (hex code)"
    )

    # Call-to-action
    button_text = models.CharField(
        max_length=50,
        default="Check it Out!",
        help_text="Button text"
    )
    button_link = models.URLField(
        blank=True,
        help_text="Button link URL"
    )

    # Display settings
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this offer is active"
    )

    class Meta:
        ordering = ['deadline']
        verbose_name = "Countdown Offer"
        verbose_name_plural = "Countdown Offers"

    def __str__(self):
        return f"{self.title} - {self.deadline}"

    @property
    def is_expired(self):
        """Check if the countdown has expired"""
        from django.utils import timezone
        return self.deadline < timezone.now()


class Testimonial(BaseModel):
    """
    Customer testimonials for homepage
    """
    customer_name = models.CharField(
        max_length=100,
        help_text="Customer name"
    )
    customer_title = models.CharField(
        max_length=100,
        blank=True,
        help_text="Customer title/position"
    )
    customer_image = models.ImageField(
        upload_to="testimonials/%Y/%m/%d/",
        blank=True,
        help_text="Customer photo"
    )

    testimonial_text = models.TextField(
        help_text="Testimonial content"
    )

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating out of 5 stars"
    )

    # Display settings
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Whether this is a featured testimonial"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this testimonial is active"
    )

    class Meta:
        ordering = ['order', '-is_featured', '-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.customer_name} - {self.rating} stars"


class NewsletterSubscription(BaseModel):
    """
    Newsletter subscriptions
    """
    email = models.EmailField(
        unique=True,
        help_text="Subscriber email address"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether subscription is active"
    )
    subscribed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the user subscribed"
    )

    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = "Newsletter Subscription"
        verbose_name_plural = "Newsletter Subscriptions"

    def __str__(self):
        return self.email
