from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date


# Function for Persian date
def persian_date():
    # Assuming you're using the default `datetime.date` format.
    # If using a specific Persian date library, replace this with the correct logic.
    return date.today()


class CustomUser(AbstractUser):
    CUSTOMER = "customer"
    SELLER = "seller"
    ADMIN = "admin"

    Roles = (
        (CUSTOMER, "Customer"),
        (SELLER, "Seller"),
        (ADMIN, "Admin"),
    )

    profile_image = models.ImageField(
        upload_to="photos/%Y/%m/%d/", blank=True, null=True
    )
    phonenumber = models.CharField(max_length=11, null=True, blank=True)
    date_birth = models.DateField(blank=True, null=True, default=persian_date)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=20, blank=True, null=True)
    street = models.CharField(max_length=30, blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    apartment = models.IntegerField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=Roles, default=CUSTOMER)
    zip_code = models.IntegerField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    register_date = models.DateField(default=persian_date, blank=False)
    additional_information = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username}"
