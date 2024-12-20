from django.db.models.signals import post_save
from django.dispatch import receiver
from product.models import Product
from .models import CartItem

@receiver(post_save, sender=Product)
def handle_product_quantity_zero(sender, instance, **kwargs):
    # Check if the product's quantity has been updated to 0
    if instance.quantity == 0:
        # Delete all cart items that contain this product
        CartItem.objects.filter(product=instance).delete()
