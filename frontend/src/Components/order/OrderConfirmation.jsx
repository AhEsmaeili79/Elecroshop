import React, { useEffect, useState } from 'react';
import { fetchOrderDetails } from './api/orderApi';
import { useParams, Link } from 'react-router-dom';

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
                setError(err.message);
                console.error('Error fetching order details:', err);
            }
        };

        getOrderDetails();
    }, [orderId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Order Confirmation</h1>
            <h2>Order ID: {orderDetails.order_code}</h2>
            <h3>Items:</h3>
            <ul>
                {orderDetails.items && orderDetails.items.length > 0 ? (
                    orderDetails.items.map(item => (
                        <Link to={`/product/${item.product}`} key={item.product} className="product-link">
                            <li>
                                {item.product_name} x {item.quantity}
                            </li>
                        </Link>
                    ))
                ) : (
                    <li>No items found.</li>
                )}
            </ul>
            <h3>Total Price: ${orderDetails.total_price}</h3>
            <p>Thank you for your order!</p>
        </div>
    );
};

export default OrderConfirmation;
