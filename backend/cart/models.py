from django.db import models
from django.conf import settings
from product.models import Product,Color 


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    @property
    def total_price(self):
        return sum(item.total_price for item in self.cart_items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="cart_items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    def __str__(self):
        return f"{self.product.name} in {self.cart.user.username}'s cart"

    @property
    def total_price(self):
        return self.product.price * self.quantity


def get_or_create_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart
