import React, { useEffect, useState } from 'react';
import { getSellerOrders } from './api/Seller_order_list'; // Import the API service
import SellerOrderDetails from './SellerOrderDetails'; // Import the new Order Details component
import './css/SellerOrdersPage.css'; // CSS for styling

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seller-specific orders on component mount
  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (error) {
        setError(error.message);
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
          <SellerOrderDetails key={order.id} order={order} />
        ))
      )}
    </div>
  );
};

export default SellerOrders;
