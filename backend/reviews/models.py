from datetime import datetime
from django.db import models
from django.contrib.auth import get_user_model
from product.models import Product  

User = get_user_model()


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE
    )
    title = models.CharField(max_length=25,default='No Title')
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f'{self.comment} , {self.created_at}'