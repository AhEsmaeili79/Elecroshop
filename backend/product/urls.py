from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,ColorViewSet, CustomerProductViewSet,WishlistViewSet,ProductColorQuantityViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(
    r"customer-products", CustomerProductViewSet, basename="customer-products"
) 
router.register(r"wishlist", WishlistViewSet, basename="wishlist")  
router.register(r"colors", ColorViewSet, basename="colors") 
router.register(r'product_color_quantities', ProductColorQuantityViewSet, basename='productcolorquantity')

urlpatterns = [
    path("", include(router.urls)),
]
