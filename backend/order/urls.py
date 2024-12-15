# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet,ShipmentPriceViewSet

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")
router.register(r'shipments', ShipmentPriceViewSet, basename='shipmentprice')


urlpatterns = [
    path("", include(router.urls)),
]
