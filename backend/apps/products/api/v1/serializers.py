from rest_framework import serializers
from django.conf import settings
from drf_spectacular.utils import extend_schema_field

from apps.products.models import Product, ProductOffer, ProductImage, Color, OfferColorQuantity
from apps.categories.models import Category, Brand, ProductModel
from apps.reviews.models import Review
from apps.users.models import Seller


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']




class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model."""

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'image']


class ProductModelSerializer(serializers.ModelSerializer):
    """Serializer for ProductModel model."""

    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = ProductModel
        fields = ['id', 'name', 'slug', 'brand', 'category']


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
    category = serializers.SerializerMethodField()
    subcategory = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    in_stock = serializers.SerializerMethodField()
    is_in_wishlist = serializers.SerializerMethodField()

    @extend_schema_field(str)
    def get_category(self, obj):
        """Get category name - parent category if it exists, otherwise the category itself."""
        if obj.category:
            if obj.category.parent:
                return obj.category.parent.name
            else:
                return obj.category.name
        return None

    @extend_schema_field(str)
    def get_subcategory(self, obj):
        """Get subcategory name if category has a parent."""
        if obj.category and obj.category.parent:
            return obj.category.name
        return None

    class Meta:
        model = Product
        fields = [
            'slug', 'name', 'brand', 'model', 'category', 'subcategory',
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
    """Serializer for product detail response with flattened structure."""

    # Flattened fields
    breadcrumb = serializers.SerializerMethodField()
    brand = serializers.CharField(source='brand.name', read_only=True)
    model = serializers.CharField(source='product_model.name', read_only=True)
    images = serializers.SerializerMethodField()
    specifications = serializers.SerializerMethodField()
    pricing = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    offers = serializers.SerializerMethodField()

    # Conditional fields based on authentication
    user = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'breadcrumb', 'brand', 'model', 'description',
            'images', 'specifications', 'pricing', 'rating', 'offers', 'user'
        ]

    def to_representation(self, instance):
        """Conditionally include user field only for authenticated users."""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if not (request and request.user and request.user.is_authenticated):
            data.pop('user', None)
        return data

    @extend_schema_field(list)
    def get_breadcrumb(self, obj):
        """Get breadcrumb with category and subcategory."""
        from django.utils.text import slugify
        breadcrumb = []
        if obj.category:
            # If category has a parent, it's a subcategory - include both parent and child
            if obj.category.parent:
                breadcrumb.append({
                    'name': obj.category.parent.name,
                    'slug': obj.category.parent.slug
                })
                breadcrumb.append({
                    'name': obj.category.name,
                    'slug': obj.category.slug
                })
            else:
                # It's a main category
                breadcrumb.append({
                    'name': obj.category.name,
                    'slug': obj.category.slug
                })
        return breadcrumb

    @extend_schema_field(list)
    def get_images(self, obj):
        """Get product images as URL list."""
        images = []
        if hasattr(obj, 'ordered_images') and obj.ordered_images:
            for img in obj.ordered_images:
                if img.image:
                    images.append(img.image.url)
        return images

    @extend_schema_field(dict)
    def get_specifications(self, obj):
        """Transform specifications to simplified format."""
        specs = obj.specifications or {}

        # Map the complex nested specs to simplified format
        simplified = {}

        # Processor
        if 'processor' in specs and isinstance(specs['processor'], dict):
            cpu = specs['processor'].get('cpu', '')
            cores = specs['processor'].get('cores', '')
            simplified['processor'] = f"{cpu} ({cores} cores)" if cpu and cores else cpu or ''

        # Memory
        if 'memory' in specs and isinstance(specs['memory'], dict):
            ram = specs['memory'].get('ram', '')
            ram_type = specs['memory'].get('type', '')
            simplified['ram'] = f"{ram} {ram_type}".strip() if ram else ''

            storage = specs['memory'].get('storage', '')
            simplified['storage'] = storage

        # Display
        if 'display' in specs and isinstance(specs['display'], dict):
            size = specs['display'].get('size', '')
            resolution = specs['display'].get('resolution', '')
            refresh_rate = specs['display'].get('refresh_rate', '')
            display_type = specs['display'].get('type', '')

            display_parts = [size, display_type, resolution]
            if refresh_rate:
                # Only add Hz if it's not already present
                refresh_str = str(refresh_rate)
                if not refresh_str.endswith('Hz'):
                    refresh_str = f"{refresh_str}Hz"
                display_parts.append(refresh_str)
            simplified['display'] = " ".join(filter(None, display_parts))

        # Graphics
        if 'graphics' in specs and isinstance(specs['graphics'], dict):
            gpu = specs['graphics'].get('gpu', '')
            vram = specs['graphics'].get('vram', '')
            simplified['graphics'] = f"{gpu} ({vram})" if gpu and vram else gpu or ''

        # Battery
        if 'battery' in specs and isinstance(specs['battery'], dict):
            life = specs['battery'].get('life', '')
            capacity = specs['battery'].get('capacity', '')
            simplified['battery'] = f"{capacity} ({life})" if capacity and life else capacity or life or ''

        # Weight
        if 'weight' in specs:
            simplified['weight'] = specs['weight']

        return simplified

    @extend_schema_field(dict)
    def get_pricing(self, obj):
        """Get pricing information across all offers."""
        offers = obj.offers.filter(is_active=True)
        if not offers.exists():
            return {'min': None, 'max': None, 'currency': 'USD'}

        prices = [offer.final_price for offer in offers]
        return {
            'min': float(min(prices)),
            'max': float(max(prices)),
            'currency': 'USD'
        }

    @extend_schema_field(dict)
    def get_rating(self, obj):
        """Get rating information."""
        return {
            'average': float(obj.avg_rating or 0),
            'count': obj.review_count or 0
        }

    @extend_schema_field(list)
    def get_offers(self, obj):
        """Get simplified offers information."""
        offers_data = []
        for offer in obj.active_offers:
            offer_data = {
                'seller': {
                    'name': offer.seller.shop_name,
                    'verified': offer.seller.is_verified
                },
                'price': float(offer.final_price),
                'in_stock': offer.stock_status
            }

            # Add colors if available
            if hasattr(offer, 'color_quantities') and offer.color_quantities.exists():
                colors = []
                for cq in offer.color_quantities.all():
                    colors.append({
                        'name': cq.color.name,
                        'hex': cq.color.color_hex,
                        'quantity': cq.quantity
                    })
                offer_data['colors'] = colors

            offers_data.append(offer_data)

        return offers_data

    @extend_schema_field(dict)
    def get_user(self, obj):
        """Get user-specific data (wishlist) only for authenticated users."""
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return {'is_in_wishlist': obj.is_in_wishlist}
        return None


class FilterOptionSerializer(serializers.Serializer):
    """Serializer for filter options."""

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

    category_slug = serializers.CharField(required=False, max_length=100)
    subcategory_slug = serializers.CharField(required=False, max_length=100)
    brand_slug = serializers.CharField(required=False, max_length=100)
    product_model_slug = serializers.CharField(required=False, max_length=100)
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
            category_slug=attrs.get('category_slug'),
            subcategory_slug=attrs.get('subcategory_slug'),
            brand_slug=attrs.get('brand_slug'),
            product_model_slug=attrs.get('product_model_slug')
        )

        # Validate search query if provided
        if 'search' in attrs and attrs['search']:
            attrs['search'] = validate_search_query(attrs['search'])

        return attrs
