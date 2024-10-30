import React from 'react';
import { Link } from 'react-router-dom';
import './css/OrderListItem.css'; // Optional: Create a CSS file for styling

const OrderListItem = ({ order }) => {
    return (
        <li className="order-list-item">
            <Link to={`/order/${order.id}`} className="order-link">
                <h4>Order ID: {order.order_code}</h4>
                <p>Total Price: ${order.total_price}</p>
                <p>Status: {order.status}</p>
            </Link>
        </li>
    );
};

export default OrderListItem;
