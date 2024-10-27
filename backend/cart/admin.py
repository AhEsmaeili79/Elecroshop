from django.contrib import admin
from .models import CartItem


# Register your models here.
class Cartadmin(admin.ModelAdmin):
    list_display = [
        "id",
        "cart__user__username",
        "product__name",
        "product_id",
        "quantity",
        "total_price",
    ]


admin.site.register(CartItem, Cartadmin)
