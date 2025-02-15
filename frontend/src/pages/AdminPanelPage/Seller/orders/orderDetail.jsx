import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetails } from '../../../../api/seller/orders';

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
           
        </div>
    );
};

export default OrderDetail;
