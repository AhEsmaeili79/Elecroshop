from datetime import datetime
from django.db import models
from django.contrib.auth import get_user_model
from product.models import Product  # Adjust if the product model is in a different app

User = get_user_model()


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, related_name="reviews", on_delete=models.CASCADE
    )
    rating = models.PositiveIntegerField()  # Adjust as necessary
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.product.name}"
