import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../../api/orderApi';
import BreadCrumb from '../../components/Breadcrumb/BreadCrumb';
import OrderProducts from './OrderProducts';
// import './css/orderDetail.css'; // Updated CSS filename to avoid conflict

const OrderDetailPage = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await fetchOrderDetails(orderCode);
        if (data.length > 0) {
          setOrder(data[0]);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderCode]);

  if (loading)
    return (
      <div className="order-detail-loading d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="order-detail-error alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );

  if (!order)
    return (
      <div className="order-detail-not-found alert alert-warning text-center mt-5" role="alert">
        No order found with the given order code.
      </div>
    );

  

  return (
    <main className="main">
      <BreadCrumb />
      <div className="page-content">
        <div className="container">
          <div className="row">
            <OrderProducts order={order} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
