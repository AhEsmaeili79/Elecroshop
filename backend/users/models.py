from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        (1, "Admin"),
        (2, "Seller"),
        (3, "Customer"),
    ]
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=3)
