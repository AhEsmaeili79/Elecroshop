import React from 'react';
import { Link } from 'react-router-dom';
import './css/OrderListItem.css'; // Optional: Create a CSS file for styling

const OrderListItem = ({ order }) => {
    return (
        <li className="orders-container">
            <Link to={`/order/${order.id}`} className="order-link">
            <h2>Order Code: {order.order_code}</h2>
            <p>Total Price: ${order.total_price}</p>
            <p>Shipment Price: ${order.shipment_price}</p>
            <p>Payment Type: {order.payment_type}</p>
            <p>Status: {order.status}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </Link>
            <h3>Items:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item.id} className="order-item">
                    <Link to={`/product/${item.product}`} className="order-link">
                        <img src={item.product_image} alt={item.product_name} className="product-image" />
                        <p>Product: {item.product_name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Seller: {item.product_seller}</p>
                        <p>Price per Unit: ${item.product_price}</p>
                    </Link>
                </li>
              ))}
            </ul>
        </li>
    );
};

export default OrderListItem;
