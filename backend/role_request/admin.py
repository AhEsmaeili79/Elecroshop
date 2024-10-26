from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import RoleRequest


class Roleadmin(admin.ModelAdmin):
    # Display specific fields on the user list page
    list_display = ("user__username", "user__email", "status", "request_time")


admin.site.register(RoleRequest, Roleadmin)
