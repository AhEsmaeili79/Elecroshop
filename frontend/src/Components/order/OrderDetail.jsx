// OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderDetails } from './api/orderApi';
// import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };
    getOrderDetails();
  }, [orderId]);

  return (
    <div className="order-detail-container">
      <h1>Order Details</h1>
      {order ? (
        <div>
            <h1>Order Detail</h1>
            <p>Order Code: {order.order_code}</p>
            <p>Status: {order.status}</p>
            <p>Total Price: ${order.total_price}</p>
            <p>Shipping Price: ${order.shipment_price}</p>
            <p>Address: {order.address}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderDetail;