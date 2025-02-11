from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet,ShipmentPriceViewSet,payment_callback

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")
router.register(r'shipments', ShipmentPriceViewSet, basename='shipmentprice')


urlpatterns = [
    path("", include(router.urls)),
    path('payment/callback/', payment_callback, name='payment_callback'),
]
