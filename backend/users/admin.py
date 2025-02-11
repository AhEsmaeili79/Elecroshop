from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Address

User = get_user_model()


class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_staff", "is_active", "date_joined")
    list_filter = ("is_staff", "is_active", "date_joined")
    search_fields = ("username", "email")


admin.site.register(User, UserAdmin)

class AddressAdmin(admin.ModelAdmin):
    list_display = ("username", "titleAddress", "city")
    
admin.site.register(Address, AddressAdmin)