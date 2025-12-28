from django.db import models
from django.utils.text import slugify
from apps.core.models import BaseModel


class Category(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to="categories/%Y/%m/%d/", blank=True, null=True)
    parent = models.OneToOneField(
        'self', on_delete=models.CASCADE, null=True, blank=True,
        related_name='child_category'
    )

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            if self.parent:
                base_slug = slugify(f"{self.parent.name}-{self.name}")
            else:
                base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            # Ensure uniqueness
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)







class Brand(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)  # <-- Add slug field
    image = models.ImageField(upload_to="brands/%Y/%m/%d/", blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            # Ensure uniqueness
            while Brand.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)




class ProductModel(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)  # <-- Add slug
    brand = models.ForeignKey(
        Brand, on_delete=models.CASCADE, related_name="product_models"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="product_models"
    )

    class Meta:
        unique_together = ('name', 'brand')

    def __str__(self):
        return f"{self.brand.name} {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.brand.name}-{self.name}")
            slug = base_slug
            counter = 1
            # Ensure uniqueness
            while ProductModel.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
