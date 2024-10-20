from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date


# Define choices for user roles
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("seller", "Seller"),
        ("customer", "Customer"),
    )

    profile_image = models.ImageField(
        upload_to="photos/%Y/%m/%d/", blank=True, null=True
    )
    phonenumber = models.CharField(max_length=11, null=True)
    date_birth = models.DateField(
        blank=True, default=date.today
    )  # Adjust if using a custom Persian date
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=20, blank=True, null=True)
    street = models.CharField(max_length=30, blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    apartment = models.IntegerField(blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="customer")
    zip_code = models.IntegerField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    register_date = models.DateField(default=date.today)
    additional_information = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username}"
