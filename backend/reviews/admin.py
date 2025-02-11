from django.contrib import admin
from .models import Review

class Reviewadmin(admin.ModelAdmin):
    list_display = ["id", "user", "title", "comment","product"]
    list_display_links =["id", "title"]

admin.site.register(Review,Reviewadmin)