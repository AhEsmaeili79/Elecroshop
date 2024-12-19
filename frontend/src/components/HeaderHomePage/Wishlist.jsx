import { useEffect } from 'react';
import { useWishlist } from '../../../contexts/WishlistContext'; // Adjust the import to your context location

const Wishlist = () => {
  const { wishlistItems, isWishlistLoading } = useWishlist(); // Destructure wishlist data and loading state

  useEffect(() => {
    // You can add any side effects or handle other logic when wishlistItems change
  }, [wishlistItems]); // Whenever the wishlistItems changes, this effect will run

  return (
    <div className="wishlist">
      <a href='/wishlist' title="Wishlist">
        <div className="icon">
          <i className="icon-heart-o"></i>
          <span className="wishlist-count badge">{isWishlistLoading ? '...' : wishlistItems.length}</span>  {/* Dynamically rendered wishlist count */}
        </div>
        <p>Wishlist</p>
      </a>
    </div>
  );
};

export default Wishlist;
