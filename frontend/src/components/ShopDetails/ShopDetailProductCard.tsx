"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";

const ShopDetailProductCard = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  // add to cart (Buy Now action for mobile)
  const handleBuyNow = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  // Extract category from title or use a default
  const getCategory = () => {
    const title = item.title.toLowerCase();
    if (title.includes("iphone") || title.includes("phone")) return "mobile";
    if (title.includes("macbook") || title.includes("laptop")) return "laptop";
    if (title.includes("imac") || title.includes("desktop")) return "desktop";
    if (title.includes("gamepad") || title.includes("controller")) return "gaming";
    if (title.includes("watch")) return "wearable";
    if (title.includes("bag") || title.includes("purse")) return "wearable";
    return "electronics";
  };

  return (
    <div className="group relative flex flex-col h-full lg:my-[10px] rounded-xl overflow-hidden bg-white dark:bg-bg-cardDark shadow-card dark:shadow-dark-2 transition-all duration-300 hover:shadow-hover dark:hover:shadow-dark-hover">
      {/* Product Image Section - Top */}
      <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px] bg-gray-1 dark:bg-bg-main-dark flex items-center justify-center overflow-hidden rounded-t-xl">
        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6">
          <Image
            src={item.imgs?.previews[0] || "/images/products/placeholder.png"}
            alt={item.title}
            width={280}
            height={280}
            className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Product Details Section - Bottom with Dark Background */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 bg-gray-2 dark:bg-bg-cardDark rounded-b-xl">
        {/* Product Title */}
        <Link
          href="/shop-details"
          onClick={() => handleProductDetails()}
          className="mb-2 group/title"
        >
          <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-text-primary dark:text-text-primary-dark line-clamp-2 group-hover/title:text-blue dark:group-hover/title:text-primary-dark transition-colors duration-200">
            {item.title}
          </h3>
        </Link>

        {/* Category/Tag */}
        <div className="mb-4">
          <span className="inline-block text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark font-medium capitalize">
            {getCategory()}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            ${item.discountedPrice.toFixed(2)}
          </span>
          {item.price > item.discountedPrice && (
            <span className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark line-through">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Buttons - Different layout for mobile vs desktop */}
        <div className="mt-auto">
          {/* Mobile: Buy Now + Wishlist side by side */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:hidden">
            {/* Buy Now Button - Light Gray */}
            <button
              onClick={() => handleBuyNow()}
              className="flex-1 inline-flex items-center justify-center font-medium text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg bg-gray-3 dark:bg-gray-2 text-text-primary dark:text-text-primary-dark transition-all duration-200 hover:bg-blue dark:hover:bg-blue hover:text-white dark:hover:text-white active:scale-95 whitespace-nowrap shadow-sm"
            >
              Buy Now
            </button>

            {/* Wishlist Button - Dark Gray with Border */}
            <button
              onClick={() => handleItemToWishList()}
              aria-label="Add to wishlist"
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gray-3 dark:bg-bg-hoverDark border-2 border-gray-5 dark:border-border-dark text-text-primary dark:text-text-primary-dark transition-all duration-200 hover:bg-red dark:hover:bg-red hover:text-white dark:hover:text-white hover:border-red dark:hover:border-red active:scale-95 flex-shrink-0"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Desktop: Add to Cart + Wishlist side by side */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Add to Cart Button - Primary */}
            <button
              onClick={() => handleAddToCart()}
              className="flex-1 inline-flex items-center justify-center font-medium text-sm py-2.5 px-4 rounded-lg bg-blue dark:bg-blue text-white transition-all duration-200 hover:bg-blue-dark dark:hover:bg-blue-dark hover:shadow-lg active:scale-95"
            >
              Add to Cart
            </button>

            {/* Wishlist Button - Icon */}
            <button
              onClick={() => handleItemToWishList()}
              aria-label="Add to wishlist"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-3 dark:bg-bg-hoverDark border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark transition-all duration-200 hover:bg-red dark:hover:bg-red hover:text-white dark:hover:text-white hover:border-red dark:hover:border-red active:scale-95 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailProductCard;

