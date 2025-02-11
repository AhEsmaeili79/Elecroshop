from django.contrib import admin
from .models import Category, SubCategory, Brand, Model

admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Brand)
admin.site.register(Model)
