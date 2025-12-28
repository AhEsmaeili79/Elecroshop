from django.urls import path

from apps.products.api.v1.views import (
    ProductListView,
    ProductDetailBySlugView,
)

app_name = 'products'

urlpatterns = [
    # Product list with filtering
    path('', ProductListView.as_view(), name='product-list'),

    # Product detail by slug
    path('<slug:slug>/', ProductDetailBySlugView.as_view(), name='product-detail-by-slug'),
]
