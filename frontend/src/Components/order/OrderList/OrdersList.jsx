// OrdersList.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from './api/orderApi'; // Ensure this function is defined correctly
import { Link } from 'react-router-dom';
import './css/OrdersList.css'; // Ensure you have a CSS file for styling

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchUserOrders(); // Call the API function
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch orders. Please try again later.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, []);

    if (loading) return <div className="loading-message">Loading your orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="orders-list">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => {
                        // Check if total_price is a valid number
                        const totalPrice = typeof order.total_price === 'number' ? order.total_price : parseFloat(order.total_price);
                        return (
                            <li key={order.id} className="order-item">
                                <Link to={`/order/${order.id}`} className="order-link">
                                    <h3>Order ID: {order.order_code}</h3>
                                    <p>Total Price: ${totalPrice ? totalPrice.toFixed(2) : 'N/A'}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Created At: {new Date(order.created_at).toLocaleDateString()}</p>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default OrdersList;
