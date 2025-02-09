import { useEffect } from 'react';
import { useWishlist } from '../../../contexts/WishlistContext'; 

const Wishlist = () => {
  const { wishlistItems, isWishlistLoading } = useWishlist(); 

  useEffect(() => {
  }, [wishlistItems]); 

  const toPersianNumerals = (number) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
  };
  return (
    <div className="wishlist">
      <a href='/wishlist' title=" علاقه‌مندی‌ها">
        <div className="icon">
          <i className="icon-heart-o" style={{cursor:'pointer'}}></i>
          <span className="wishlist-count badge">{isWishlistLoading ? '...' : toPersianNumerals(wishlistItems.length)}</span>  
        </div>
        <p> علاقه‌مندی‌ها</p>
      </a>
    </div>
  );
};

export default Wishlist;
