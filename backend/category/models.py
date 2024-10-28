# category/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="subcategories"
    )

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Model(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="models")
    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="models"
    )

    def __str__(self):
        return self.name
