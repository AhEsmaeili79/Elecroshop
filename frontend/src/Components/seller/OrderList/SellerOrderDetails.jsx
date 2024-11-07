import React from 'react';
import SellerOrderItem from './SellerOrderItem';

const SellerOrderDetails = ({ order }) => {
  return (
    <div key={order.id} className="order-card">
      <h2>Order Code: {order.order_code}</h2>
      <p>Total Price: ${order.total_price}</p>
      <p>Shipment Price: ${order.shipment_price}</p>
      <p>Payment Type: {order.payment_type}</p>
      <p>Status: {order.status}</p>
      <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>

      <h3>Items:</h3>
      <ul>
        {order.items
          .filter((item) => item.product_seller) // Filter out items without a seller
          .map((item) => (
            <SellerOrderItem key={item.id} item={item} /> // Use SellerOrderItem component
          ))}
      </ul>
    </div>
  );
};

export default SellerOrderDetails;
