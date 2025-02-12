from django.db.models.signals import post_save
from django.dispatch import receiver
from product.models import Product
from .models import CartItem
from product.models import ProductColorQuantity

@receiver(post_save, sender=Product)
def handle_product_quantity_zero(sender, instance, **kwargs):
    product_colors = ProductColorQuantity.objects.filter(product=instance)
    
    for product_color in product_colors:
        if product_color.quantity == 0:
            CartItem.objects.filter(product=instance, color=product_color.color, cart__user__isnull=False).delete()
