// OrderItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './css/OrderItem.css';

const OrderItemDetails = ({ productName, productPrice, quantity }) => (
    <div className="product-details">
        <span className="product-name">{productName}</span>
        <span className="product-quantity-price">${productPrice.toFixed(2)} x {quantity}</span>
    </div>
);

const OrderItem = ({ item }) => (
    <li className="order-item">
        <Link to={`/product/${item.product}`} className="product-link">
            <img src={item.product_image} alt={item.product_name} className="product-image" />
            <OrderItemDetails 
                productName={item.product_name} 
                productPrice={item.product_price} 
                quantity={item.quantity} 
            />
        </Link>
    </li>
);

export default OrderItem;
