// SellerOrders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/SellerOrdersPage.css'; // Create this file for styling

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seller-specific orders on component mount
  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/order/orders/', {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your auth method
          }
      });
        setOrders(response.data);
      } catch (error) {
        setError('Failed to load orders.');
        console.error('Error fetching seller orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="seller-orders-container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found for your products.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Order Code: {order.order_code}</h2>
            <p>Total Price: ${order.total_price}</p>
            <p>Shipment Price: ${order.shipment_price}</p>
            <p>Payment Type: {order.payment_type}</p>
            <p>Status: {order.status}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>

            <h3>Items:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item.id} className="order-item">
                  <img src={item.product_image} alt={item.product_name} className="product-image" />
                  <p>Product: {item.product_name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Seller: {item.product_seller}</p>
                  <p>Price per Unit: ${item.product_price}</p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
