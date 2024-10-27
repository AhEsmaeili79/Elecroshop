# product/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CustomerProductViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(
    r"customer-products", CustomerProductViewSet, basename="customer-products"
)  # Read-only for customers

urlpatterns = [
    path("", include(router.urls)),
]
