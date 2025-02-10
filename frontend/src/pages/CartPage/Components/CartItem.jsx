import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../css/Cart.rtl.css"; 
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [toastShown, setToastShown] = useState(false); 

  function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }
  
  const totalprice = item.product.price * item.quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= item.product.quantity && newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(item.id, newQuantity);
      setToastShown(false); 
    } else {
      if (!toastShown) {
        if (newQuantity > 10) {
          toast.error("شما فقط می‌توانید حداکثر 10 عدد از این محصول را به سبد خرید خود اضافه کنید.");
        } else {
          toast.error(`فقط ${item.product.quantity} عدد از این محصول در انبار موجود است.`);
        }
        setToastShown(true); 
      }
    }
  };

  return (
    <tr className="cart-item" style={{ direction: 'rtl' }}>
      <td className="product-col">
        <div className="product">
          <figure className="product-media">
            <Link to={`/product/${item.product.id}`}>
              <img 
                src={item.product.main_photo} 
                alt={item.product.name} 
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
      <td className="price-col">{`${formatPrice(item.product.price)} تومان`}</td>
      <td className="quantity-col">
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1} 
          >
            -
          </button>
          <span>{formatPrice(item.quantity)}</span>
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.quantity}  
          >
            +
          </button>
        </div>
      </td>

      <td className="total-col">{`${formatPrice(totalprice)} تومان`}</td>

      <td className="remove-col">
        <button className="btn-remove" onClick={() => onRemove(item.id)}>
          <i className="icon-close"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
