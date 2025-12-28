from typing import Optional
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.categories.models import Category, SubCategory, Brand, ProductModel
from apps.products.models import Product


def validate_product_slug(slug: str) -> Product:
    """
    Validate that product exists by slug and is active.

    Args:
        slug: Product slug to validate

    Returns:
        Product instance

    Raises:
        ValidationError: If product doesn't exist or is inactive
    """
    try:
        product = Product.objects.get(slug=slug, is_active=True)
        return product
    except Product.DoesNotExist:
        raise ValidationError(f"Product with slug '{slug}' not found or inactive.")


def validate_category_id(category_id: int) -> Category:
    """
    Validate that category exists.

    Args:
        category_id: Category ID to validate

    Returns:
        Category instance

    Raises:
        ValidationError: If category doesn't exist
    """
    try:
        return Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        raise ValidationError(f"Category with id {category_id} does not exist.")


def validate_subcategory_id(subcategory_id: int) -> SubCategory:
    """
    Validate that subcategory exists.

    Args:
        subcategory_id: Subcategory ID to validate

    Returns:
        SubCategory instance

    Raises:
        ValidationError: If subcategory doesn't exist
    """
    try:
        return SubCategory.objects.get(id=subcategory_id)
    except SubCategory.DoesNotExist:
        raise ValidationError(f"Subcategory with id {subcategory_id} does not exist.")


def validate_brand_id(brand_id: int) -> Brand:
    """
    Validate that brand exists.

    Args:
        brand_id: Brand ID to validate

    Returns:
        Brand instance

    Raises:
        ValidationError: If brand doesn't exist
    """
    try:
        return Brand.objects.get(id=brand_id)
    except Brand.DoesNotExist:
        raise ValidationError(f"Brand with id {brand_id} does not exist.")


def validate_product_model_id(product_model_id: int) -> ProductModel:
    """
    Validate that product model exists.

    Args:
        product_model_id: Product model ID to validate

    Returns:
        ProductModel instance

    Raises:
        ValidationError: If product model doesn't exist
    """
    try:
        return ProductModel.objects.get(id=product_model_id)
    except ProductModel.DoesNotExist:
        raise ValidationError(f"Product model with id {product_model_id} does not exist.")


def validate_category_slug(category_slug: str) -> Category:
    """
    Validate that category exists by slug.

    Args:
        category_slug: Category slug to validate

    Returns:
        Category instance

    Raises:
        ValidationError: If category doesn't exist
    """
    try:
        return Category.objects.get(slug=category_slug)
    except Category.DoesNotExist:
        raise ValidationError(f"Category with slug '{category_slug}' does not exist.")


def validate_subcategory_slug(subcategory_slug: str) -> SubCategory:
    """
    Validate that subcategory exists by slug.

    Args:
        subcategory_slug: Subcategory slug to validate

    Returns:
        SubCategory instance

    Raises:
        ValidationError: If subcategory doesn't exist
    """
    try:
        return SubCategory.objects.get(slug=subcategory_slug)
    except SubCategory.DoesNotExist:
        raise ValidationError(f"Subcategory with slug '{subcategory_slug}' does not exist.")


def validate_brand_slug(brand_slug: str) -> Brand:
    """
    Validate that brand exists by slug.

    Args:
        brand_slug: Brand slug to validate

    Returns:
        Brand instance

    Raises:
        ValidationError: If brand doesn't exist
    """
    try:
        return Brand.objects.get(slug=brand_slug)
    except Brand.DoesNotExist:
        raise ValidationError(f"Brand with slug '{brand_slug}' does not exist.")


def validate_product_model_slug(product_model_slug: str) -> ProductModel:
    """
    Validate that product model exists by slug.

    Args:
        product_model_slug: Product model slug to validate

    Returns:
        ProductModel instance

    Raises:
        ValidationError: If product model doesn't exist
    """
    try:
        return ProductModel.objects.get(slug=product_model_slug)
    except ProductModel.DoesNotExist:
        raise ValidationError(f"Product model with slug '{product_model_slug}' does not exist.")


def validate_product_filters(
    category_slug: Optional[str] = None,
    subcategory_slug: Optional[str] = None,
    brand_slug: Optional[str] = None,
    product_model_slug: Optional[str] = None
) -> None:
    """
    Validate product filter combinations using slugs.

    Args:
        category_slug: Category slug filter
        subcategory_slug: Subcategory slug filter
        brand_slug: Brand slug filter
        product_model_slug: Product model slug filter

    Raises:
        ValidationError: If filter combination is invalid
    """
    # Validate individual slugs exist
    if category_slug:
        validate_category_slug(category_slug)

    if subcategory_slug:
        subcategory = validate_subcategory_slug(subcategory_slug)
        # Check if subcategory belongs to the specified category
        if category_slug:
            category = validate_category_slug(category_slug)
            if subcategory.category_id != category.id:
                raise ValidationError(
                    f"Subcategory '{subcategory.name}' does not belong to category '{category.name}'."
                )

    if brand_slug:
        validate_brand_slug(brand_slug)

    if product_model_slug:
        product_model = validate_product_model_slug(product_model_slug)
        # Check relationships
        if brand_slug:
            brand = validate_brand_slug(brand_slug)
            if product_model.brand_id != brand.id:
                raise ValidationError(
                    f"Product model '{product_model.name}' does not belong to brand '{brand.name}'."
                )
        if subcategory_slug:
            subcategory = validate_subcategory_slug(subcategory_slug)
            if product_model.sub_category_id != subcategory.id:
                raise ValidationError(
                    f"Product model '{product_model.name}' does not belong to subcategory '{subcategory.name}'."
                )


def validate_search_query(search_query: str) -> str:
    """
    Validate search query.

    Args:
        search_query: Search query string

    Returns:
        Cleaned search query

    Raises:
        ValidationError: If search query is invalid
    """
    if not search_query or not search_query.strip():
        raise ValidationError("Search query cannot be empty.")

    cleaned_query = search_query.strip()
    if len(cleaned_query) < 2:
        raise ValidationError("Search query must be at least 2 characters long.")

    if len(cleaned_query) > 100:
        raise ValidationError("Search query cannot exceed 100 characters.")

    return cleaned_query


def validate_ordering(ordering: str) -> str:
    """
    Validate ordering parameter.

    Args:
        ordering: Ordering string

    Returns:
        Validated ordering string

    Raises:
        ValidationError: If ordering is invalid
    """
    allowed_orderings = [
        'name', '-name',
        'created_at', '-created_at',
        'avg_rating', '-avg_rating',
        'review_count', '-review_count',
        'price', '-price'
    ]

    if ordering not in allowed_orderings:
        raise ValidationError(
            f"Invalid ordering '{ordering}'. Allowed values: {', '.join(allowed_orderings)}"
        )

    return ordering


def validate_pagination_params(page: Optional[int] = None, page_size: Optional[int] = None) -> tuple:
    """
    Validate pagination parameters.

    Args:
        page: Page number
        page_size: Items per page

    Returns:
        Tuple of (page, page_size)

    Raises:
        ValidationError: If pagination params are invalid
    """
    if page is not None:
        if page < 1:
            raise ValidationError("Page must be greater than 0.")

    if page_size is not None:
        if page_size < 1:
            raise ValidationError("Page size must be greater than 0.")
        if page_size > 100:
            raise ValidationError("Page size cannot exceed 100.")

    return page, page_size
