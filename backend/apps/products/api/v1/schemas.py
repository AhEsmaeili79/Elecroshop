"""
Dynamic OpenAPI schemas for products endpoints.
These schemas are automatically generated based on serializer fields.
"""
from drf_spectacular.utils import extend_schema_serializer, inline_serializer, OpenApiExample, OpenApiResponse, OpenApiParameter
from rest_framework import serializers

from apps.products.api.v1.serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductQueryParamsSerializer,
    ProductListResponseSerializer,
)


# Dynamic schema generation utility
def get_dynamic_schema_from_serializer(serializer_class, name=None):
    """
    Dynamically generate an OpenAPI schema from a serializer class.

    Args:
        serializer_class: DRF Serializer class
        name: Optional name for the schema

    Returns:
        Inline serializer schema
    """
    if name is None:
        name = serializer_class.__name__

    fields = {}
    if hasattr(serializer_class, '_declared_fields'):
        for field_name, field in serializer_class._declared_fields.items():
            fields[field_name] = field

    return inline_serializer(name=name, fields=fields)


# Request schemas - use serializers directly for automatic sync
product_list_request_schema = ProductQueryParamsSerializer
product_detail_response_schema = ProductDetailSerializer

# Response schemas
product_list_response_schema = ProductListResponseSerializer

# Simple response schemas
not_found_response_schema = inline_serializer(
    name='NotFoundResponse',
    fields={'detail': serializers.CharField(help_text='Error message')}
)

validation_error_response_schema = inline_serializer(
    name='ValidationErrorResponse',
    fields={
        field_name: serializers.ListField(
            child=serializers.CharField(),
            required=False,
            help_text=f'{field_name.replace("_", " ").title()} validation errors'
        )
        for field_name in [
            'category_id', 'subcategory_id', 'brand_id', 'product_model_id',
            'search', 'ordering', 'page', 'page_size',
            'non_field_errors'
        ]
    }
)


# Enhanced request schema with examples
@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Filter by category',
            value={'category_id': 1}
        ),
        OpenApiExample(
            'Search products',
            value={'search': 'laptop'}
        ),
        OpenApiExample(
            'Filter and sort',
            value={'category_id': 1, 'brand_id': 2, 'ordering': '-avg_rating'}
        ),
        OpenApiExample(
            'Pagination',
            value={'page': 1, 'page_size': 20}
        ),
    ]
)
class ProductListRequestSchema(ProductQueryParamsSerializer):
    """Enhanced schema for product list with examples."""
    pass


# View schema configurations for @extend_schema decorators
product_list_view_schema = {
    'parameters': [
        OpenApiParameter(
            name='category_slug',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Filter by category slug',
            required=False
        ),
        OpenApiParameter(
            name='subcategory_slug',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Filter by subcategory slug',
            required=False
        ),
        OpenApiParameter(
            name='brand_slug',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Filter by brand slug',
            required=False
        ),
        OpenApiParameter(
            name='product_model_slug',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Filter by product model slug',
            required=False
        ),
        OpenApiParameter(
            name='search',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Search in product name and description',
            required=False
        ),
        OpenApiParameter(
            name='ordering',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Ordering field',
            required=False,
            enum=[
                'name', '-name',
                'created_at', '-created_at',
                'avg_rating', '-avg_rating',
                'review_count', '-review_count'
            ]
        ),
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number',
            required=False
        ),
        OpenApiParameter(
            name='page_size',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Items per page (max 100)',
            required=False
        ),
    ],
    'responses': {
        200: product_list_response_schema,
        400: validation_error_response_schema,
    },
    'summary': 'List products with filtering',
    'tags': ['Products'],
    'operation_id': 'list_products',
}

product_detail_by_id_view_schema = {
    'responses': {
        200: product_detail_response_schema,
        404: not_found_response_schema,
    },
    'summary': 'Get product details by ID',
    'tags': ['Products'],
    'operation_id': 'get_product_detail_by_id',
}

product_detail_by_slug_view_schema = {
    'responses': {
        200: product_detail_response_schema,
        404: not_found_response_schema,
    },
    'summary': 'Get product details by slug',
    'tags': ['Products'],
    'operation_id': 'get_product_detail_by_slug',
}
