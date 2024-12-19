import React from "react";

const WishlistButton = ({ isFavorited, handleAddToWishlist }) => (
  <a className="btn-product btn-wishlist" title="Wishlist" onClick={handleAddToWishlist}>
    <span>{isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}</span>
  </a>
);

export default WishlistButton;
