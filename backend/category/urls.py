from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubCategoryViewSet, BrandViewSet, ModelViewSet,SellerCategoryViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"subcategories", SubCategoryViewSet)
router.register(r"brands", BrandViewSet)
router.register(r"models", ModelViewSet)
router.register(r'seller-categories', SellerCategoryViewSet, basename='seller-category')

urlpatterns = [
    path("", include(router.urls)),
]
