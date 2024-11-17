from django.contrib import admin

from .models import Product,Color,Wishlist


# Register your models here.
class Productadmin(admin.ModelAdmin):
    list_display = ["name", "quantity", "price", "seller__username"]


admin.site.register(Product, Productadmin)


admin.site.register(Color)
admin.site.register(Wishlist)