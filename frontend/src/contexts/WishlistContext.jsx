import { createContext, useContext, useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../api/wishlistApi';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

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
      loadWishlist(); 
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      loadWishlist();
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
    }
  };

  useEffect(() => {
    loadWishlist(); 
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
