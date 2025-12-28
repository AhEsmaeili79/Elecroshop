import logging

from django.core.exceptions import ValidationError
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.api.v1.schemas import (
    product_list_view_schema,
    product_detail_by_slug_view_schema,
)
from apps.products.api.v1.serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductQueryParamsSerializer,
    ProductFiltersSerializer,
)
from apps.products.services import ProductService
from apps.products.validators import validate_product_slug

logger = logging.getLogger('apps.products')


class ProductListView(APIView):
    """View for listing products with filtering and pagination."""

    permission_classes = [AllowAny]

    @extend_schema(**product_list_view_schema)
    def get(self, request):
        """Get paginated list of products with filtering."""
        try:
            # Validate and parse query parameters
            serializer = ProductQueryParamsSerializer(data=request.GET)
            if not serializer.is_valid():
                logger.warning(
                    f'Product list validation failed: errors={serializer.errors}, '
                    f'ip={request.META.get("REMOTE_ADDR")}'
                )
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            validated_data = serializer.validated_data

            # Get products with filters
            result = ProductService.get_products_list_with_filters(
                category_slug=validated_data.get('category_slug'),
                subcategory_slug=validated_data.get('subcategory_slug'),
                brand_slug=validated_data.get('brand_slug'),
                product_model_slug=validated_data.get('product_model_slug'),
                search_query=validated_data.get('search'),
                ordering=validated_data.get('ordering', '-created_at'),
                user=request.user if request.user.is_authenticated else None
            )

            # Paginate results
            page = validated_data.get('page', 1)
            page_size = validated_data.get('page_size', 20)

            paginator = Paginator(result['products'], page_size)

            try:
                products_page = paginator.page(page)
            except PageNotAnInteger:
                products_page = paginator.page(1)
            except EmptyPage:
                products_page = paginator.page(paginator.num_pages)

            # Serialize products
            product_serializer = ProductListSerializer(
                products_page.object_list,
                many=True,
                context={'request': request}
            )

            # Serialize filter options
            filter_serializer = ProductFiltersSerializer(result['filter_options'])

            # Prepare response data
            response_data = {
                'data': product_serializer.data,
                'filter_options': filter_serializer.data,
                'applied_filters': result['applied_filters'],
                'total_count': paginator.count,
                'page': products_page.number,
                'page_size': page_size,
                'total_pages': paginator.num_pages,
            }

            logger.info(
                f'Product list requested: filters={result["applied_filters"]}, '
                f'page={products_page.number}, count={len(product_serializer.data)}, '
                f'user_id={request.user.id if request.user.is_authenticated else None}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(
                f'Product list error: {str(e)}, '
                f'user_id={request.user.id if request.user.is_authenticated else None}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {'detail': 'An error occurred while fetching products.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailBySlugView(APIView):
    """View for getting product details by slug."""

    permission_classes = [AllowAny]

    @extend_schema(**product_detail_by_slug_view_schema)
    def get(self, request, slug):
        """Get detailed information about a product by slug."""
        try:
            # Validate product slug
            try:
                validate_product_slug(slug)
            except ValidationError:
                return Response(
                    {'detail': 'Product not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            product = ProductService.get_product_detail_by_slug(slug, request.user)

            if not product:
                return Response(
                    {'detail': 'Product not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize product
            serializer = ProductDetailSerializer(
                product,
                context={'request': request}
            )

            logger.info(
                f'Product detail by slug requested: product_id={product.id}, slug={product.slug}, '
                f'user_id={request.user.id if request.user.is_authenticated else None}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(
                f'Product detail by slug error: slug={slug}, error={str(e)}, '
                f'user_id={request.user.id if request.user.is_authenticated else None}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {'detail': 'An error occurred while fetching product details.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
