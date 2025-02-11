from django.contrib import admin
from .models import Order, OrderItem, ShipmentPrice, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1  


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "order_code",
        "shipment_price",
        "address",
        "payment_type",
        "status",
        "created_at_date",
    )
    search_fields = ("order_code", "user__username", "address")
    list_filter = ("status", "payment_type")
    inlines = [OrderItemInline] 


class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "order__order_code",
        "order__user",
        "product",
        "product__name",
        "quantity",
        "color",
    )
    search_fields = ("order__order_code", "product__name")
    list_filter = ("order__status",)


class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "amount",
        "payment_method",
        "status",
        "transaction_ref_id",
        "created_at",
    )
    search_fields = ("order__order_code", "transaction_ref_id")
    list_filter = ("status", "payment_method")


admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShipmentPrice, admin.ModelAdmin)
admin.site.register(Payment, PaymentAdmin)
