from typing import Optional, Dict, Any, List
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import transaction, models
from django.db.models import Q

from apps.products.models import Product, ProductOffer, ProductImage
from apps.products.selectors import (
    get_products_list,
    get_product_detail,
    get_product_by_slug,
    get_categories_for_filtering,
    get_brands_for_filtering,
    get_subcategories_for_filtering,
    get_product_models_for_filtering
)
from apps.reviews.models import Wishlist

User = get_user_model()


class ProductService:
    """Service class for product-related business logic."""

    @staticmethod
    def get_products_list_with_filters(
        category_id: Optional[int] = None,
        subcategory_id: Optional[int] = None,
        brand_id: Optional[int] = None,
        product_model_id: Optional[int] = None,
        search_query: Optional[str] = None,
        ordering: str = '-created_at',
        user: Optional[User] = None
    ) -> Dict[str, Any]:
        """
        Get products list with filtering and additional metadata.

        Args:
            category_id: Filter by category ID
            subcategory_id: Filter by subcategory ID
            brand_id: Filter by brand ID
            product_model_id: Filter by product model ID
            search_query: Search in product name and description
            ordering: Ordering field
            user: User for wishlist status

        Returns:
            Dict containing products queryset and filter metadata
        """
        # Get filtered products
        products = get_products_list(
            category_id=category_id,
            subcategory_id=subcategory_id,
            brand_id=brand_id,
            product_model_id=product_model_id,
            search_query=search_query,
            ordering=ordering,
            user=user
        )

        # Get filter options
        filter_options = {
            'categories': get_categories_for_filtering(),
            'brands': get_brands_for_filtering(),
            'subcategories': get_subcategories_for_filtering(category_id),
            'product_models': get_product_models_for_filtering(brand_id, subcategory_id),
        }

        return {
            'products': products,
            'filter_options': filter_options,
            'applied_filters': {
                'category_id': category_id,
                'subcategory_id': subcategory_id,
                'brand_id': brand_id,
                'product_model_id': product_model_id,
                'search_query': search_query,
                'ordering': ordering,
            }
        }

    @staticmethod
    def get_product_detail(product_id: int, user: Optional[User] = None) -> Optional[Product]:
        """
        Get product detail with all related data.

        Args:
            product_id: Product ID
            user: User for wishlist status

        Returns:
            Product instance or None
        """
        return get_product_detail(product_id, user)

    @staticmethod
    def get_product_detail_by_slug(slug: str, user: Optional[User] = None) -> Optional[Product]:
        """
        Get product detail by slug with all related data.

        Args:
            slug: Product slug
            user: User for wishlist status

        Returns:
            Product instance or None
        """
        return get_product_by_slug(slug, user)

    @staticmethod
    def check_product_in_wishlist(product: Product, user: User) -> bool:
        """
        Check if a product is in user's wishlist.

        Args:
            product: Product instance
            user: User instance

        Returns:
            True if product is in wishlist, False otherwise
        """
        if not user or not user.is_authenticated:
            return False

        return Wishlist.objects.filter(
            user=user,
            offer__product=product
        ).exists()

    @staticmethod
    def get_product_rating_summary(product: Product) -> Dict[str, Any]:
        """
        Get rating summary for a product.

        Args:
            product: Product instance

        Returns:
            Dict with rating summary
        """
        from django.db.models import Count, Avg

        rating_stats = product.reviews.aggregate(
            avg_rating=Avg('rating'),
            total_reviews=Count('id'),
            rating_1=Count('id', filter=Q(rating=1)),
            rating_2=Count('id', filter=Q(rating=2)),
            rating_3=Count('id', filter=Q(rating=3)),
            rating_4=Count('id', filter=Q(rating=4)),
            rating_5=Count('id', filter=Q(rating=5)),
        )

        return {
            'average_rating': rating_stats['avg_rating'] or 0,
            'total_reviews': rating_stats['total_reviews'] or 0,
            'rating_distribution': {
                1: rating_stats['rating_1'] or 0,
                2: rating_stats['rating_2'] or 0,
                3: rating_stats['rating_3'] or 0,
                4: rating_stats['rating_4'] or 0,
                5: rating_stats['rating_5'] or 0,
            }
        }

    @staticmethod
    def get_product_main_image(product: Product) -> Optional[str]:
        """
        Get the main image URL for a product.

        Args:
            product: Product instance

        Returns:
            Image URL or None
        """
        if hasattr(product, 'ordered_images') and product.ordered_images:
            return product.ordered_images[0].image.url
        elif product.images.exists():
            return product.images.first().image.url
        return None

    @staticmethod
    def get_product_price_range(product: Product) -> Dict[str, Any]:
        """
        Get price range for a product across all active offers.

        Args:
            product: Product instance

        Returns:
            Dict with min/max prices and offer count
        """
        offers = product.offers.filter(is_active=True)
        if not offers.exists():
            return {
                'min_price': None,
                'max_price': None,
                'offer_count': 0
            }

        prices = offers.values_list('final_price', flat=True)
        return {
            'min_price': min(prices),
            'max_price': max(prices),
            'offer_count': len(prices)
        }

    @staticmethod
    def validate_product_filters(
        category_id: Optional[int] = None,
        subcategory_id: Optional[int] = None,
        brand_id: Optional[int] = None,
        product_model_id: Optional[int] = None
    ) -> None:
        """
        Validate product filter combinations.

        Args:
            category_id: Category ID
            subcategory_id: Subcategory ID
            brand_id: Brand ID
            product_model_id: Product model ID

        Raises:
            ValidationError: If filter combination is invalid
        """
        from apps.categories.models import Category, SubCategory, Brand, ProductModel

        # Validate category exists if provided
        if category_id:
            try:
                Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                raise ValidationError(f"Category with id {category_id} does not exist.")

        # Validate subcategory exists and belongs to category if both provided
        if subcategory_id:
            try:
                subcategory = SubCategory.objects.get(id=subcategory_id)
                if category_id and subcategory.category_id != category_id:
                    raise ValidationError(
                        f"Subcategory {subcategory_id} does not belong to category {category_id}."
                    )
            except SubCategory.DoesNotExist:
                raise ValidationError(f"Subcategory with id {subcategory_id} does not exist.")

        # Validate brand exists if provided
        if brand_id:
            try:
                Brand.objects.get(id=brand_id)
            except Brand.DoesNotExist:
                raise ValidationError(f"Brand with id {brand_id} does not exist.")

        # Validate product model exists and relationships if provided
        if product_model_id:
            try:
                product_model = ProductModel.objects.get(id=product_model_id)
                if brand_id and product_model.brand_id != brand_id:
                    raise ValidationError(
                        f"Product model {product_model_id} does not belong to brand {brand_id}."
                    )
                if subcategory_id and product_model.sub_category_id != subcategory_id:
                    raise ValidationError(
                        f"Product model {product_model_id} does not belong to subcategory {subcategory_id}."
                    )
            except ProductModel.DoesNotExist:
                raise ValidationError(f"Product model with id {product_model_id} does not exist.")


class WishlistService:
    """Service class for wishlist-related operations."""

    @staticmethod
    def add_to_wishlist(user: User, offer_id: int, color_id: Optional[int] = None) -> Wishlist:
        """
        Add product offer to user's wishlist.

        Args:
            user: User instance
            offer_id: Product offer ID
            color_id: Optional color ID

        Returns:
            Wishlist instance

        Raises:
            ValidationError: If offer doesn't exist or already in wishlist
        """
        from apps.products.models import ProductOffer, Color

        try:
            offer = ProductOffer.objects.get(id=offer_id, is_active=True)
        except ProductOffer.DoesNotExist:
            raise ValidationError("Product offer not found or inactive.")

        color = None
        if color_id:
            try:
                color = Color.objects.get(id=color_id)
            except Color.DoesNotExist:
                raise ValidationError("Color not found.")

        # Check if already in wishlist
        existing = Wishlist.objects.filter(
            user=user,
            offer=offer,
            color=color
        ).exists()

        if existing:
            raise ValidationError("Product is already in your wishlist.")

        # Create wishlist item
        return Wishlist.objects.create(
            user=user,
            offer=offer,
            color=color
        )

    @staticmethod
    def remove_from_wishlist(user: User, offer_id: int, color_id: Optional[int] = None) -> bool:
        """
        Remove product offer from user's wishlist.

        Args:
            user: User instance
            offer_id: Product offer ID
            color_id: Optional color ID

        Returns:
            True if removed, False if not found
        """
        from apps.products.models import Color

        color = None
        if color_id:
            try:
                color = Color.objects.get(id=color_id)
            except Color.DoesNotExist:
                return False

        deleted, _ = Wishlist.objects.filter(
            user=user,
            offer_id=offer_id,
            color=color
        ).delete()

        return deleted > 0

    @staticmethod
    def get_user_wishlist(user: User) -> List[Wishlist]:
        """
        Get user's wishlist items.

        Args:
            user: User instance

        Returns:
            List of wishlist items with related data
        """
        return Wishlist.objects.filter(user=user).select_related(
            'offer__product',
            'offer__seller',
            'color'
        ).order_by('-created_at')
