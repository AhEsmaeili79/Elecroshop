from django.contrib import admin
from .models import CustomUser


# Register your models here.
@admin.register(CustomUser)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "username"]
