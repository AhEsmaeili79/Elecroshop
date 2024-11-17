# product/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CustomerProductViewSet,WishlistViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(
    r"customer-products", CustomerProductViewSet, basename="customer-products"
)  # Read-only for customers
router.register(r"wishlist", WishlistViewSet, basename="wishlist")  # Register Wishlist API

urlpatterns = [
    path("", include(router.urls)),
]
