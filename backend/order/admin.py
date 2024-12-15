# order/admin.py

from django.contrib import admin
from .models import Order, OrderItem,ShipmentPrice


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1  # Number of empty forms to display for adding items


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "order_code",
        "shipment_price",
        "total_price",
        "address",
        "payment_type",
        "status",
        "created_at",
    )
    search_fields = ("order_code", "user__username", "address")
    list_filter = ("status", "payment_type")
    inlines = [OrderItemInline]  # Display OrderItem as inline
    readonly_fields = ("total_price",)  # Make total_price read-only


class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order__id",
        "order__order_code",
        "order__user",
        "product__name",
        "product__seller",
        "quantity",
    )


# Register your models
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShipmentPrice,admin.ModelAdmin)