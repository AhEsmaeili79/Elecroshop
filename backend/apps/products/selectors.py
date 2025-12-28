from typing import Optional, List, Dict, Any
from django.db import models
from django.db.models import Q, Avg, Count, Prefetch, F, Case, When, Value, BooleanField
from django.contrib.auth import get_user_model

from apps.products.models import Product, ProductOffer, ProductImage
from apps.reviews.models import Review, Wishlist
from apps.categories.models import Category, SubCategory, Brand, ProductModel

User = get_user_model()


def get_products_list(
    category_id: Optional[int] = None,
    subcategory_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    product_model_id: Optional[int] = None,
    search_query: Optional[str] = None,
    is_active: bool = True,
    user: Optional[User] = None,
    ordering: str = '-created_at'
) -> models.QuerySet:
    """
    Get products list with filtering, ratings, and wishlist status.

    Args:
        category_id: Filter by category ID
        subcategory_id: Filter by subcategory ID
        brand_id: Filter by brand ID
        product_model_id: Filter by product model ID
        search_query: Search in product name and description
        is_active: Filter by active status (default True)
        user: User for wishlist status (optional)
        ordering: Ordering field (default '-created_at')

    Returns:
        QuerySet of products with ratings and wishlist annotations
    """
    # Base queryset
    queryset = Product.objects.filter(is_active=is_active)

    # Apply filters
    if category_id:
        queryset = queryset.filter(category_id=category_id)

    if subcategory_id:
        queryset = queryset.filter(sub_category_id=subcategory_id)

    if brand_id:
        queryset = queryset.filter(brand_id=brand_id)

    if product_model_id:
        queryset = queryset.filter(product_model_id=product_model_id)

    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )

    # Add ratings aggregation
    queryset = queryset.annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    )

    # Add main image (first image ordered by order field)
    queryset = queryset.prefetch_related(
        Prefetch(
            'images',
            queryset=ProductImage.objects.order_by('order'),
            to_attr='ordered_images'
        )
    )

    # Add wishlist status if user is authenticated
    if user and user.is_authenticated:
        # Get user's wishlist offers
        wishlist_offer_ids = Wishlist.objects.filter(
            user=user
        ).values_list('offer_id', flat=True)

        # Annotate if any of the product's offers are in user's wishlist
        queryset = queryset.annotate(
            is_in_wishlist=Case(
                When(
                    Q(offers__id__in=wishlist_offer_ids),
                    then=Value(True)
                ),
                default=Value(False),
                output_field=BooleanField()
            )
        ).distinct()
    else:
        # For anonymous users, always False
        queryset = queryset.annotate(
            is_in_wishlist=Value(False, output_field=BooleanField())
        )

    # Apply ordering
    if ordering:
        queryset = queryset.order_by(ordering)

    return queryset


def get_product_detail(product_id: int, user: Optional[User] = None) -> Optional[Product]:
    """
    Get product detail with all related data.

    Args:
        product_id: Product ID
        user: User for wishlist status (optional)

    Returns:
        Product instance with all related data or None if not found
    """
    try:
        # Base queryset with all related data
        queryset = Product.objects.select_related(
            'category',
            'sub_category',
            'brand',
            'product_model',
            'product_model__brand',
            'product_model__sub_category',
            'product_model__sub_category__category'
        ).prefetch_related(
            # Product images
            Prefetch(
                'images',
                queryset=ProductImage.objects.order_by('order'),
                to_attr='ordered_images'
            ),
            # Product offers with seller and colors
            Prefetch(
                'offers',
                queryset=ProductOffer.objects.select_related('seller').prefetch_related(
                    Prefetch(
                        'color_quantities',
                        queryset=ProductOffer.objects.filter(
                            offer__color_quantities__isnull=False
                        ).select_related('color'),
                        to_attr='color_quantities_with_colors'
                    )
                ).filter(is_active=True),
                to_attr='active_offers'
            ),
            # Reviews with user data
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('user').order_by('-created_at'),
                to_attr='all_reviews'
            )
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        )

        product = queryset.get(id=product_id, is_active=True)

        # Add wishlist status for each offer if user is authenticated
        if user and user.is_authenticated:
            wishlist_offers = Wishlist.objects.filter(
                user=user,
                offer__product=product
            ).select_related('offer', 'color')

            # Create a mapping of offer_id -> wishlist status
            wishlist_map = {}
            for wishlist_item in wishlist_offers:
                offer_id = wishlist_item.offer.id
                if offer_id not in wishlist_map:
                    wishlist_map[offer_id] = []
                wishlist_map[offer_id].append({
                    'color_id': wishlist_item.color.id if wishlist_item.color else None,
                    'color_hex': wishlist_item.color.color_hex if wishlist_item.color else None,
                    'specs_snapshot': wishlist_item.specs_snapshot
                })

            # Attach wishlist data to offers
            for offer in product.active_offers:
                offer.wishlist_items = wishlist_map.get(offer.id, [])

        return product

    except Product.DoesNotExist:
        return None


def get_product_by_slug(slug: str, user: Optional[User] = None) -> Optional[Product]:
    """
    Get product detail by slug with all related data.

    Args:
        slug: Product slug
        user: User for wishlist status (optional)

    Returns:
        Product instance with all related data or None if not found
    """
    try:
        # Base queryset with all related data
        queryset = Product.objects.select_related(
            'category',
            'sub_category',
            'brand',
            'product_model',
            'product_model__brand',
            'product_model__sub_category',
            'product_model__sub_category__category'
        ).prefetch_related(
            # Product images
            Prefetch(
                'images',
                queryset=ProductImage.objects.order_by('order'),
                to_attr='ordered_images'
            ),
            # Product offers with seller and colors
            Prefetch(
                'offers',
                queryset=ProductOffer.objects.select_related('seller').prefetch_related(
                    'color_quantities__color'
                ).filter(is_active=True),
                to_attr='active_offers'
            ),
            # Reviews with user data
            Prefetch(
                'reviews',
                queryset=Review.objects.select_related('user').order_by('-created_at'),
                to_attr='all_reviews'
            )
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        )

        product = queryset.get(slug=slug, is_active=True)

        # Add wishlist status for each offer if user is authenticated
        if user and user.is_authenticated:
            wishlist_offers = Wishlist.objects.filter(
                user=user,
                offer__product=product
            ).select_related('offer', 'color')

            # Create a mapping of offer_id -> wishlist status
            wishlist_map = {}
            for wishlist_item in wishlist_offers:
                offer_id = wishlist_item.offer.id
                if offer_id not in wishlist_map:
                    wishlist_map[offer_id] = []
                wishlist_map[offer_id].append({
                    'color_id': wishlist_item.color.id if wishlist_item.color else None,
                    'color_hex': wishlist_item.color.color_hex if wishlist_item.color else None,
                    'specs_snapshot': wishlist_item.specs_snapshot
                })

            # Attach wishlist data to offers
            for offer in product.active_offers:
                offer.wishlist_items = wishlist_map.get(offer.id, [])

        return product

    except Product.DoesNotExist:
        return None


def get_categories_for_filtering() -> models.QuerySet:
    """
    Get categories with product counts for filtering.

    Returns:
        QuerySet of categories with product counts
    """
    return Category.objects.annotate(
        product_count=Count('product', filter=Q(product__is_active=True))
    ).filter(product_count__gt=0).order_by('name')


def get_brands_for_filtering() -> models.QuerySet:
    """
    Get brands with product counts for filtering.

    Returns:
        QuerySet of brands with product counts
    """
    return Brand.objects.annotate(
        product_count=Count('product', filter=Q(product__is_active=True))
    ).filter(product_count__gt=0).order_by('name')


def get_subcategories_for_filtering(category_id: Optional[int] = None) -> models.QuerySet:
    """
    Get subcategories with product counts for filtering.

    Args:
        category_id: Filter by category ID (optional)

    Returns:
        QuerySet of subcategories with product counts
    """
    queryset = SubCategory.objects.annotate(
        product_count=Count('product', filter=Q(product__is_active=True))
    ).filter(product_count__gt=0)

    if category_id:
        queryset = queryset.filter(category_id=category_id)

    return queryset.order_by('name')


def get_product_models_for_filtering(
    brand_id: Optional[int] = None,
    subcategory_id: Optional[int] = None
) -> models.QuerySet:
    """
    Get product models with product counts for filtering.

    Args:
        brand_id: Filter by brand ID (optional)
        subcategory_id: Filter by subcategory ID (optional)

    Returns:
        QuerySet of product models with product counts
    """
    queryset = ProductModel.objects.annotate(
        product_count=Count('products', filter=Q(products__is_active=True))
    ).filter(product_count__gt=0)

    if brand_id:
        queryset = queryset.filter(brand_id=brand_id)

    if subcategory_id:
        queryset = queryset.filter(sub_category_id=subcategory_id)

    return queryset.order_by('name')
