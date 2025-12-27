from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.conf import settings
from category.models import Category, Brand
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from users.models import Seller


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    specifications = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def clean(self):
        if not isinstance(self.specifications, dict):
            raise ValidationError("Specifications must be a JSON object")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        indexes = [
            GinIndex(fields=['specifications'])
        ]



class ProductOffer(models.Model):
    product = models.ForeignKey(
        Product, related_name="offers", on_delete=models.CASCADE
    )
    
    seller = models.ForeignKey(
    Seller, on_delete=models.CASCADE, related_name="offers"
    )


    price = models.DecimalField(max_digits=10,decimal_places=2)
    stock_status = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['product', 'seller'],
                name='unique_product_seller_offer'
            )
        ]
        indexes = [
            models.Index(fields=['product', 'price']),
            models.Index(fields=['seller']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.seller}"



class Color(models.Model):
    color_hex = models.CharField(max_length=7, unique=True)

    def __str__(self):
        return self.color_hex



class OfferColorQuantity(models.Model):
    offer = models.ForeignKey(
        ProductOffer, related_name="color_quantities", on_delete=models.CASCADE
    )
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('offer', 'color')



class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="products/%Y/%m/%d/")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ('product', 'order')


    def save(self, *args, **kwargs):
        if not self.pk and ProductImage.objects.filter(product=self.product).count() >= 10:
            raise ValidationError("Maximum 10 images allowed per product")
        super().save(*args, **kwargs)
