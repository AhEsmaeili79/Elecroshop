import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    
      <div className="cart-item">
        <Link to={`/product/${item.product.id}`} className="product-link">
        <img src={item.product.main_photo} alt={item.product.name} className="cart-item-image" />
        </Link>
        <div className="cart-item-details">
        <Link to={`/product/${item.product.id}`} className="product-link">
          <h2>{item.product.name}</h2>
        </Link>
          <p>Price: ${item.product.price.toFixed(2) * item.quantity}</p>
          <div className="quantity-controls">
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <button onClick={() => onRemove(item.id)} className="remove-button">Remove</button>
        </div>
      </div>
  );
};

export default CartItem;
