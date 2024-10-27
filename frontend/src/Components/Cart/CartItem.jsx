import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.product.main_photo} alt={item.product.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h2>{item.product.name}</h2>
        <p>Price: ${item.product.price.toFixed(2)}</p>
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
