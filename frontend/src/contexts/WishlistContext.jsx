import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../components/ProductList/Components/api/wishlist';

const WishlistContext = createContext();

// Custom hook to use the WishlistContext
export const useWishlist = () => useContext(WishlistContext);

// WishlistProvider component to provide the context
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Fetch the wishlist from the API
  const loadWishlist = async () => {
    try {
      setIsWishlistLoading(true);
      const data = await fetchWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      loadWishlist(); // Refresh wishlist in real-time
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      loadWishlist(); // Refresh wishlist in real-time
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
    }
  };

  useEffect(() => {
    loadWishlist(); // Load wishlist on initial mount
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isWishlistLoading,
      handleAddToWishlist,
      handleRemoveFromWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
