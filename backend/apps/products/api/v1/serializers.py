from rest_framework import serializers
from django.conf import settings
from drf_spectacular.utils import extend_schema_field

from apps.products.models import Product, ProductOffer, ProductImage, Color, OfferColorQuantity
from apps.categories.models import Category, SubCategory, Brand, ProductModel
from apps.reviews.models import Review
from apps.users.models import Seller


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']


class SubCategorySerializer(serializers.ModelSerializer):
    """Serializer for SubCategory model."""

    category = CategorySerializer(read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category']


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model."""

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'image']


class ProductModelSerializer(serializers.ModelSerializer):
    """Serializer for ProductModel model."""

    brand = BrandSerializer(read_only=True)
    sub_category = SubCategorySerializer(read_only=True)

    class Meta:
        model = ProductModel
        fields = ['id', 'name', 'slug', 'brand', 'sub_category']


class SellerSerializer(serializers.ModelSerializer):
    """Serializer for Seller model."""

    class Meta:
        model = Seller
        fields = ['id', 'user', 'shop_name', 'is_verified']


class ColorSerializer(serializers.ModelSerializer):
    """Serializer for Color model."""

    class Meta:
        model = Color
        fields = ['id', 'name', 'color_hex']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model."""

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'order']

    @extend_schema_field(str)
    def get_image_url(self, obj):
        """Get full image URL."""
        if obj.image:
            return obj.image.url
        return None


class OfferColorQuantitySerializer(serializers.ModelSerializer):
    """Serializer for OfferColorQuantity model."""

    color = ColorSerializer(read_only=True)
    quantity = serializers.IntegerField()

    class Meta:
        model = OfferColorQuantity
        fields = ['color', 'quantity']


class ProductOfferSerializer(serializers.ModelSerializer):
    """Serializer for ProductOffer model."""

    seller = SellerSerializer(read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    color_quantities = OfferColorQuantitySerializer(many=True, read_only=True, source='color_quantities.all')
    wishlist_items = serializers.SerializerMethodField()

    class Meta:
        model = ProductOffer
        fields = [
            'id', 'seller', 'price', 'stock_status', 'is_active',
            'final_price', 'color_quantities', 'wishlist_items'
        ]

    @extend_schema_field(list)
    def get_wishlist_items(self, obj):
        """Get wishlist items for this offer."""
        return getattr(obj, 'wishlist_items', [])


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user_name', 'user_email', 'title', 'rating',
            'comment', 'created_at'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for simplified product list response."""

    brand = serializers.CharField(source='brand.name', read_only=True)
    model = serializers.CharField(source='product_model.name', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    in_stock = serializers.SerializerMethodField()
    is_in_wishlist = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'slug', 'name', 'brand', 'model', 'category',
            'image', 'price', 'rating', 'in_stock', 'is_in_wishlist'
        ]

    @extend_schema_field(str)
    def get_image(self, obj):
        """Get the main product image URL."""
        if hasattr(obj, 'ordered_images') and obj.ordered_images:
            return obj.ordered_images[0].image.url
        elif obj.images.exists():
            return obj.images.first().image.url
        return None

    @extend_schema_field(int)
    def get_price(self, obj):
        """Get minimum price."""
        offers = obj.offers.filter(is_active=True)
        if not offers.exists():
            return None

        prices = [offer.final_price for offer in offers]
        return min(prices)

    @extend_schema_field(dict)
    def get_rating(self, obj):
        """Get rating as average/count object."""
        return {
            'average': obj.avg_rating,
            'count': obj.review_count
        }

    @extend_schema_field(bool)
    def get_in_stock(self, obj):
        """Check if product is in stock across any offers."""
        return obj.offers.filter(is_active=True, stock_status=True).exists()

    @extend_schema_field(bool)
    def get_is_in_wishlist(self, obj):
        """Check if product is in user's wishlist."""
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False

        return obj.is_in_wishlist


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail response."""

    category = CategorySerializer(read_only=True)
    sub_category = SubCategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    product_model = ProductModelSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True, source='ordered_images')
    offers = ProductOfferSerializer(many=True, read_only=True, source='active_offers')
    reviews = ReviewSerializer(many=True, read_only=True, source='all_reviews')
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    rating_summary = serializers.SerializerMethodField()
    is_in_wishlist = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'sub_category', 'brand',
            'product_model', 'description', 'specifications', 'is_active',
            'images', 'offers', 'reviews', 'avg_rating', 'review_count',
            'rating_summary', 'is_in_wishlist', 'created_at', 'updated_at'
        ]

    @extend_schema_field(dict)
    def get_rating_summary(self, obj):
        """Get detailed rating summary."""
        from django.db.models import Count

        if not hasattr(obj, 'reviews') or not obj.reviews.exists():
            return {
                'average_rating': 0,
                'total_reviews': 0,
                'rating_distribution': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }

        # Calculate rating distribution
        rating_counts = {}
        for i in range(1, 6):
            rating_counts[i] = obj.reviews.filter(rating=i).count()

        return {
            'average_rating': obj.avg_rating or 0,
            'total_reviews': obj.review_count or 0,
            'rating_distribution': rating_counts
        }

    @extend_schema_field(bool)
    def get_is_in_wishlist(self, obj):
        """Check if product is in user's wishlist."""
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False

        return obj.is_in_wishlist


class FilterOptionSerializer(serializers.Serializer):
    """Serializer for filter options."""

    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField(required=False)
    product_count = serializers.IntegerField()


class ProductFiltersSerializer(serializers.Serializer):
    """Serializer for product filters response."""

    categories = FilterOptionSerializer(many=True)
    subcategories = FilterOptionSerializer(many=True)
    brands = FilterOptionSerializer(many=True)
    product_models = FilterOptionSerializer(many=True)


class ProductListResponseSerializer(serializers.Serializer):
    """Serializer for product list API response."""

    data = ProductListSerializer(many=True)
    filter_options = ProductFiltersSerializer()
    applied_filters = serializers.DictField()
    total_count = serializers.IntegerField()
    page = serializers.IntegerField(required=False)
    page_size = serializers.IntegerField(required=False)
    total_pages = serializers.IntegerField(required=False)


class ProductQueryParamsSerializer(serializers.Serializer):
    """Serializer for product list query parameters."""

    category_id = serializers.IntegerField(required=False, min_value=1)
    subcategory_id = serializers.IntegerField(required=False, min_value=1)
    brand_id = serializers.IntegerField(required=False, min_value=1)
    product_model_id = serializers.IntegerField(required=False, min_value=1)
    search = serializers.CharField(required=False, max_length=100)
    ordering = serializers.ChoiceField(
        choices=[
            'name', '-name',
            'created_at', '-created_at',
            'avg_rating', '-avg_rating',
            'review_count', '-review_count'
        ],
        default='-created_at'
    )
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    page_size = serializers.IntegerField(required=False, min_value=1, max_value=100, default=20)

    def validate(self, attrs):
        """Validate query parameters."""
        from apps.products.validators import validate_product_filters, validate_search_query

        # Validate filter combinations
        validate_product_filters(
            category_id=attrs.get('category_id'),
            subcategory_id=attrs.get('subcategory_id'),
            brand_id=attrs.get('brand_id'),
            product_model_id=attrs.get('product_model_id')
        )

        # Validate search query if provided
        if 'search' in attrs and attrs['search']:
            attrs['search'] = validate_search_query(attrs['search'])

        return attrs
