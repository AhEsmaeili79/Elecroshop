// OrderSummary.jsx
import React, { useEffect, useState } from 'react';
import { fetchOrderSummary } from './api/orderApi';
// import './OrderSummary.css';

const OrderSummary = () => {
  const [orderSummary, setOrderSummary] = useState([]);

  useEffect(() => {
    const getOrderSummary = async () => {
      try {
        const data = await fetchOrderSummary();
        setOrderSummary(data);
      } catch (error) {
        console.error("Failed to fetch order summary:", error);
      }
    };
    getOrderSummary();
  }, []);

  return (
    <div className="order-summary-container">
      <h1>Order Summary</h1>
      {orderSummary.length > 0 ? (
        <ul>
          {orderSummary.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Total Price: {order.total_price}</p>
              {/* Display other summary details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrderSummary;
