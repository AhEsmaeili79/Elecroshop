import React from "react";

const WishlistButton = ({ isFavorited, handleAddToWishlist }) => (
  <a className="btn-product btn-wishlist" title=" علاقه مندی" onClick={handleAddToWishlist}>
    <span>{isFavorited ? " حذف از علاقه مندی ها" : "افزودن به علاقه مندی ها"}</span>
  </a>
);

export default WishlistButton;
