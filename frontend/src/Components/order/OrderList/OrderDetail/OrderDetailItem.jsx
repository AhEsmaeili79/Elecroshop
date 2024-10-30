import React from 'react';
import { Link } from 'react-router-dom';
import './css/OrderDetailItem.css'; // Optional: Create a CSS file for styling

const OrderDetailItem = ({ item }) => {
    return (
        <li className="order-detail-item">
            <Link to={`/product/${item.product}`} className="product-link">
                <img 
                    src={item.product_image} 
                    alt={item.product_name} 
                    className="product-image"
                />
                <span>{item.product_name} - ${item.product_price} x {item.quantity}</span>
            </Link>
        </li>
    );
};

export default OrderDetailItem;
