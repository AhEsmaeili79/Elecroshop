import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../../api/orderApi';
import { fetchShippingOptions } from '../../api/shipment';
import './css/OrdersList.rtl.css'; 

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(4);

  useEffect(() => {
    const getData = async () => {
      try {
        const [ordersData, shippingData] = await Promise.all([
          fetchUserOrders(),
          fetchShippingOptions(),
        ]);
        
        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(`${a.created_at_date} ${a.created_at_time}`);
          const dateB = new Date(`${b.created_at_date} ${b.created_at_time}`);
          return dateB - dateA; 
        });

        setOrders(sortedOrders);
        setShippingOptions(shippingData);
      } catch (err) {
        setError('عدم توانایی در دریافت داده‌ها. لطفا دوباره تلاش کنید.');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const calculateTotalPrice = (items, shipmentPrice) => {
    const itemsTotal = items.reduce((total, item) => {
      const price = parseFloat(item.product_price) || 0;
      const quantity = parseInt(item.quantity, 10) || 1;
      return total + price * quantity;
    }, 0);
    return itemsTotal + shipmentPrice;
  };

  const getShipmentPrice = (shipmentCode) => {
    const shippingOption = shippingOptions.find(option => option.id === shipmentCode);
    return shippingOption ? shippingOption.price : 0;
  };

  const getStatusInPersian = (status) => {
    const statusMapping = {
      canceled: 'کنسل',
      successful: 'موفق',
      pending: 'در انتظار پرداخت',
      delivered: 'تحویل شده',
      returned: 'مرجوع',
    };
    return statusMapping[status] || status; 
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>خلاصه سفارشات</h2>
      <div>
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => {
            const shipmentPrice = getShipmentPrice(order.shipment_price);
            const totalPrice = calculateTotalPrice(order.items, shipmentPrice);
            return (
              <div
                key={order.id}
                className="order-item"
              >
                {/* Created At Timestamp */}
                <span className="order-timestamp">
                  {formatTime(order.created_at_time)} {order.created_at_date} {getStatusInPersian(order.status)}
                </span>

                <h4>کد سفارش: 
                  <Link to={`/orders/${order.order_code}`}>{order.order_code}</Link>
                </h4>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} style={{ margin: '5px' }}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="total-price">
                  <strong>قیمت نهایی:</strong> {totalPrice} تومان
                </p>
              </div>
            );
          })
        ) : (
          <div>هیچ سفارشی یافت نشد.</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        >
          قبلی
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
