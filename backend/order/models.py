from django.db import models
from django.contrib.auth import get_user_model
from product.models import Product, Color
from users.models import Address
from utils.utils import get_persian_datetime
import random

User = get_user_model()
persian_date, persian_time = get_persian_datetime()

def generate_order_code():
    return str(random.randint(1000000, 9999999))

class ShipmentPrice(models.Model):
    title = models.CharField(max_length=20)
    price = models.PositiveIntegerField()

    def __str__(self):
        return f"Title: {self.title} Price: {self.price}"

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ("canceled", "کنسل"),
        ("successful", "موفق"),
        ("pending", "در انتظار پرداخت"),
        ("delivered", "تحویل شده"),
        ("returned", "مرجوع"),
    ]

    PAYMENT_TYPE_CHOICES = [
        ("cash", "نقد"),
        ("credit_card", "درگاه پرداخت"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_code = models.CharField(max_length=7, unique=True, default=generate_order_code)
    shipment_price = models.ForeignKey(ShipmentPrice, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default="cash")
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default="pending")
    total_amount = models.PositiveIntegerField()
    created_at_date = models.DateField(default=persian_date)
    created_at_time = models.TimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.order_code} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    color = models.ForeignKey(Color, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity}) in Order {self.order.order_code}"

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("pending", "در انتظار پرداخت"),
        ("paid", "پرداخت شده"),
        ("failed", "ناموفق"),
    ]

    order = models.OneToOneField(Order, related_name="payment", on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()
    payment_method = models.CharField(max_length=20, choices=Order.PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    transaction_ref_id = models.CharField(max_length=100, null=True, blank=True)
    authority = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.order_code} - {self.get_status_display()}"
