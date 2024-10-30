// OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { fetchOrderDetails } from '../api/orderApi';
import { useParams } from 'react-router-dom';
import OrderItem from './OrderItem';
import './css/OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                const data = await fetchOrderDetails(orderId);
                setOrderDetails(data);
            } catch (err) {
                setError('We encountered an error while fetching your order. Please try again later.');
                console.error('Error fetching order details:', err);
            }
        };

        getOrderDetails();
    }, [orderId]);

    if (error) return <div className="error-message">{error}</div>;
    if (!orderDetails) return <div className="loading-message">Loading order details...</div>;

    return (
        <div className="order-confirmation">
            <header className="confirmation-header">
                <h1>Thank You for Your Purchase!</h1>
                <p>Your order has been placed successfully.</p>
            </header>
            <section className="order-summary">
                <h2>Order ID: {orderDetails.order_code}</h2>
                <h3>Order Summary</h3>
                <ul className="items-list">
                    {orderDetails.items.length > 0 ? (
                        orderDetails.items.map((item) => <OrderItem key={item.id} item={item} />)
                    ) : (
                        <li>No items found.</li>
                    )}
                </ul>
            </section>
            <footer className="order-total">
                <h3>Total Amount Paid: ${orderDetails.total_price}</h3>
            </footer>
        </div>
    );
};

export default OrderConfirmation;
