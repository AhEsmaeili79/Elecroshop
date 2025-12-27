from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="categories/%Y/%m/%d/", blank=True, null=True)

    def __str__(self):
        return self.name



class SubCategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="subcategories"
    )

    class Meta:
        unique_together = ('name', 'category')

    def __str__(self):
        return f"{self.category.name} → {self.name}"




class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="brands/%Y/%m/%d/", blank=True, null=True)

    def __str__(self):
        return self.name




class ProductModel(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(
        Brand, on_delete=models.CASCADE, related_name="product_models"
    )
    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="product_models"
    )

    class Meta:
        unique_together = ('name', 'brand')

    def __str__(self):
        return f"{self.brand.name} {self.name}"
