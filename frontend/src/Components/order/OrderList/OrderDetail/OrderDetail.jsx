import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetails } from '../api/orderApi'; // Ensure this function is defined
import OrderDetailItem from './OrderDetailItem';
import './css/OrderDetail.css'; // Optional: Create a CSS file for styling

const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                const data = await fetchOrderDetails(orderId);
                setOrderDetails(data);
            } catch (err) {
                setError('Failed to fetch order details. Please try again later.');
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        getOrderDetails();
    }, [orderId]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!orderDetails) return <div>No order details found.</div>;

    return (
        <div className="order-detail">
            <h1>Order Details</h1>
            <h2>Order ID: {orderDetails.order_code}</h2>
            <h3>Status: {orderDetails.status}</h3>
            <h4>Total Price: ${orderDetails.total_price}</h4>
            <h4>Shipment Price: ${orderDetails.shipment_price}</h4>
            <h4>Address: {orderDetails.address}</h4>
            <h4>Payment Type: {orderDetails.payment_type}</h4>
            <h4>Created At: {new Date(orderDetails.created_at).toLocaleDateString()}</h4>
            
            <h3>Items:</h3>
            <ul className="order-items">
                {orderDetails.items.map(item => (
                    <OrderDetailItem key={item.id} item={item} />
                ))}
            </ul>
            <Link to="/orders" className="back-link">Back to Orders</Link>
        </div>
    );
};

export default OrderDetail;
