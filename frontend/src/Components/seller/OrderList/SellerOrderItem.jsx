import React from 'react';

const SellerOrderItem = ({ item }) => {
  return (
    <li className="order-item">
      <img
        src={item.product_image}
        alt={item.product_name}
        className="product-image"
      />
      <p>Product: {item.product_name}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Price per Unit: ${item.product_price}</p>
    </li>
  );
};

export default SellerOrderItem;
