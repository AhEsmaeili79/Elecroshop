from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  
    image = models.ImageField(upload_to="categories/%Y/%m/%d/", blank=True, null=True)  

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="subcategories"
    )
    owner = models.ForeignKey(
        User, related_name="subcategories", on_delete=models.CASCADE
    )  

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  
    image = models.ImageField(upload_to="brand/%Y/%m/%d/", blank=True, null=True)  
    
    def __str__(self):
        return self.name


class Model(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="models")
    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="models"
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  

    def __str__(self):
        return self.name
