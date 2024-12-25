import { Link } from 'react-router-dom';
import "../css/Cart.rtl.css"; // Ensure the cart styles are properly included

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <tr className="cart-item">
      <td className="product-col">
        <div className="product">
          {/* Wrap both the image and product title in one Link */}
          <figure className="product-media">
            <Link to={`/product/${item.product.id}`}>
              <img 
                src={item.product.main_photo} 
                alt={item.product.name} 
                className="cart-item-image"
              />
            </Link>
          </figure>
          <div className="product-info">
            <h3 className="product-title">
              <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
            </h3>
            
            <p className="product-seller">{item.product.seller || 'فروشنده ناشناخته'}</p>
          </div>
        </div>
      </td>
      <td className="price-col">
        <a 
          href="#" 
          style={{
            display: "inline-block",
            width: "24px",
            height: "24px",
            backgroundColor: item.color.color_hex,
            border:"2px solid #dbdbdb",
            borderRadius: "50%",
            cursor: "pointer",
            marginLeft: "5px",
          }}>
        </a>
      </td>
      <td className="price-col">{`${item.product.price} تومان`}</td>
      <td className="quantity-col">
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button 
            className="quantity-btn"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </td>

      <td className="total-col">{`${item.product.price * item.quantity} تومان`}</td>

      <td className="remove-col">
        <button className="btn-remove" onClick={() => onRemove(item.id)}>
          <i className="icon-close"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
