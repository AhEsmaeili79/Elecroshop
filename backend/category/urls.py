from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubCategoryViewSet, BrandViewSet, ModelViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"subcategories", SubCategoryViewSet)
router.register(r"brands", BrandViewSet)
router.register(r"models", ModelViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
