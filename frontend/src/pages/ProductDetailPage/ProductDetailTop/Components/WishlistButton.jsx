import { FaHeart, FaRegHeart } from 'react-icons/fa'; 

const WishlistButton = ({ isFavorited, handleAddToWishlist }) => (
  <a 
    className={`btn-product btn ${isFavorited ? 'text-danger' : 'text-dark'}`} 
    title="علاقه مندی"
    onClick={handleAddToWishlist}
    style={{
      borderRadius: '4px', 
      padding: '8px 16px', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center'
    }}
  >
    {isFavorited ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-dark" />}
    <span style={{ marginRight: '8px' }}>
      {isFavorited ? "حذف از علاقه مندی" : "افزودن به علاقه مندی ها"}
    </span>
  </a>
);

export default WishlistButton;
