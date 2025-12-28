from django.urls import path

from apps.products.api.v1.views import (
    ProductListView,
    ProductDetailByIdView,
    ProductDetailBySlugView,
)

app_name = 'products'

urlpatterns = [
    # Product list with filtering
    path('', ProductListView.as_view(), name='product-list'),

    # Product detail by ID
    path('<int:product_id>/', ProductDetailByIdView.as_view(), name='product-detail-by-id'),

    # Product detail by slug
    path('<slug:slug>/', ProductDetailBySlugView.as_view(), name='product-detail-by-slug'),
]
