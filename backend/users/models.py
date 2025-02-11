from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date


class CustomUser(AbstractUser):
    CUSTOMER = "customer"
    SELLER = "seller"
    ADMIN = "admin"

    Roles = (
        (CUSTOMER, "Customer"),
        (SELLER, "Seller"),
        (ADMIN, "Admin"),
    )
    
    role = models.CharField(max_length=20, choices=Roles, default=CUSTOMER)
    profile_image = models.ImageField(
        upload_to="photos/%Y/%m/%d/", blank=True, null=True
    )
    phonenumber = models.CharField(max_length=11, null=True, blank=True)
    date_birth = models.DateField(blank=True, null=True, default=date.today)
    additional_information = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username}"

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = self.ADMIN
        super().save(*args, **kwargs)

class Address(models.Model):
    username = models.ForeignKey(CustomUser,models.CASCADE,null=False)
    titleAddress = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=20, blank=True, null=True)
    street = models.CharField(max_length=30, blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    apartment = models.IntegerField(blank=True, null=True)
    zip_code = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.titleAddress or 'Address'} for {self.username}"