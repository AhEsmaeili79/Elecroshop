import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../api/orderApi'; // Ensure this function is defined
import OrderListItem from './OrderListItem';
import './css/OrdersList.css'; // Optional: Create a CSS file for styling

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchUserOrders();
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

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!orders.length) return <div>No orders found.</div>;

    return (
        <div className="orders-list">
            <h1>Your Orders</h1>
            <ul>
                {orders.map(order => (
                    <OrderListItem key={order.id} order={order} />
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;
