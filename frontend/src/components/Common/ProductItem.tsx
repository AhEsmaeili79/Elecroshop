"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();

  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  const handleAddToCart = () => {
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

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-bg-cardDark border border-gray-3 dark:border-border-dark transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-2 hover:border-blue/20 dark:hover:border-blue/30">
      {/* Product Image Section - Top 60-70% */}
      <div className="relative w-full h-[280px] sm:h-[300px] lg:h-[320px] bg-gray-1 dark:bg-bg-cardDark flex items-center justify-center overflow-hidden">
        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Image
            src={item.imgs?.previews[0] || "/images/products/placeholder.png"}
            alt={item.title}
            width={250}
            height={250}
            className="object-contain max-w-full max-h-full transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-1 group-hover:drop-shadow-lg"
          />
        </div>

        {/* Wishlist Button - Top Right Corner */}
        <button
          onClick={() => handleItemToWishList()}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-gray-3 dark:bg-bg-hoverDark border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark transition-all duration-300 hover:bg-red dark:hover:bg-red hover:text-white dark:hover:text-white hover:border-red dark:hover:border-red active:scale-95 shadow-sm transform hover:scale-110 hover:rotate-6"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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

      {/* Product Details Section - Bottom 30-40% */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 bg-white dark:bg-bg-cardDark border-t border-gray-3 dark:border-border-dark group-hover:bg-gray-50/50 dark:group-hover:bg-bg-hoverDark/50 transition-colors duration-300">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow dark:text-yellow"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-custom-sm text-text-secondary dark:text-text-secondary-dark font-medium">
            ({item.reviews})
          </span>
        </div>

        {/* Product Title */}
        <Link
          href="/shop-details"
          onClick={() => handleProductDetails()}
          className="mb-2.5 group/title"
        >
          <h3 className="font-semibold text-base sm:text-lg text-text-primary dark:text-text-primary-dark line-clamp-2 group-hover/title:text-blue dark:group-hover/title:text-primary-dark transition-colors duration-200">
            {item.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            ${item.discountedPrice.toFixed(2)}
          </span>
          {item.price > item.discountedPrice && (
            <span className="text-base sm:text-lg text-text-secondary dark:text-text-secondary-dark line-through">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mt-auto">
          {/* Add to Cart Button - Primary */}
          <button
            onClick={() => handleAddToCart()}
            className="flex-1 inline-flex items-center justify-center font-medium text-custom-sm sm:text-base py-2.5 px-4 rounded-lg bg-blue dark:bg-blue text-white transition-all duration-300 hover:bg-blue-dark dark:hover:bg-blue-dark hover:shadow-lg hover:shadow-blue/25 active:scale-95 transform hover:scale-105"
          >
            Add to Cart
          </button>

          {/* View Button - Icon */}
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            aria-label="Quick view"
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gray-3 dark:bg-bg-hoverDark border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark transition-all duration-300 hover:bg-blue dark:hover:bg-blue hover:text-white dark:hover:text-white hover:border-blue dark:hover:border-blue active:scale-95 transform hover:scale-110 hover:rotate-12"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
