from typing import Optional
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.categories.models import Category, SubCategory, Brand, ProductModel
from apps.products.models import Product


def validate_product_id(product_id: int) -> Product:
    """
    Validate that product exists and is active.

    Args:
        product_id: Product ID to validate

    Returns:
        Product instance

    Raises:
        ValidationError: If product doesn't exist or is inactive
    """
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        return product
    except Product.DoesNotExist:
        raise ValidationError(f"Product with id {product_id} not found or inactive.")


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


def validate_product_filters(
    category_id: Optional[int] = None,
    subcategory_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    product_model_id: Optional[int] = None
) -> None:
    """
    Validate product filter combinations.

    Args:
        category_id: Category ID filter
        subcategory_id: Subcategory ID filter
        brand_id: Brand ID filter
        product_model_id: Product model ID filter

    Raises:
        ValidationError: If filter combination is invalid
    """
    # Validate individual IDs exist
    if category_id:
        validate_category_id(category_id)

    if subcategory_id:
        subcategory = validate_subcategory_id(subcategory_id)
        # Check if subcategory belongs to the specified category
        if category_id and subcategory.category_id != category_id:
            raise ValidationError(
                f"Subcategory '{subcategory.name}' does not belong to category with id {category_id}."
            )

    if brand_id:
        validate_brand_id(brand_id)

    if product_model_id:
        product_model = validate_product_model_id(product_model_id)
        # Check relationships
        if brand_id and product_model.brand_id != brand_id:
            raise ValidationError(
                f"Product model '{product_model.name}' does not belong to brand with id {brand_id}."
            )
        if subcategory_id and product_model.sub_category_id != subcategory_id:
            raise ValidationError(
                f"Product model '{product_model.name}' does not belong to subcategory with id {subcategory_id}."
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
