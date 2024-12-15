# order/models.py
import random
from django.db import models
from django.contrib.auth import get_user_model
from product.models import Product
from users.models import Address

User = get_user_model()

# Helper function to generate a 7-digit random order code
def generate_order_code():
    return str(random.randint(1000000, 9999999))

class ShipmentPrice(models.Model):
    title = models.CharField(max_length=20)
    price = models.PositiveIntegerField()

    def __str__(self):
        return (
            f" Title:{self.title} Price:{self.price}"
        )

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ("canceled", "Canceled"),
        ("successful", "Successful"),
        ("pending", "Pending to Pay"),
        ("delivered", "Delivered"),
        ("returned", "Returned"),
    ]
    payment_type = [
        ("cash", "Cash"),
        ("credit_card", "Credit card"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_code = models.CharField(
        max_length=7, unique=True, default=generate_order_code
    )
    shipment_price = models.ForeignKey(ShipmentPrice, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    payment_type = models.CharField(
        max_length=20, choices=payment_type, default="cash"
    )
    status = models.CharField(
        max_length=20, choices=ORDER_STATUS_CHOICES, default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_code} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return (
            f"{self.product.name} (x{self.quantity}) in Order {self.order.order_code}"
        )
