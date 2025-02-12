from django.contrib import admin
from .models import Product,Color,Wishlist,ProductColorQuantity

class Productadmin(admin.ModelAdmin):
    list_display = ["id","name", "price", "seller__username"]

class ProductColorQuantityAdmin(admin.ModelAdmin):
    list_display = ('product', 'color', 'quantity')
    list_filter = ('product', 'color')  
    search_fields = ('product__name', 'color__color_hex') 
    ordering = ('product', 'color')  
    list_per_page = 20  

    fieldsets = (
        (None, {
            'fields': ('product', 'color', 'quantity')
        }),
    )
    
admin.site.register(ProductColorQuantity, ProductColorQuantityAdmin)
admin.site.register(Product, Productadmin)
admin.site.register(Color)
admin.site.register(Wishlist)
