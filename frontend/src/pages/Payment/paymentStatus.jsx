import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { verifyPayment } from '../../api/paymentcallback';
import HeaderSection from '../../components/Header/HeaderMiddle/HeaderSection';
import Footer from '../../components/Footer/Footer';
import BreadCrumb from '../../components/Breadcrumb/BreadCrumb';
import PaymentHeader from '../../assets/images/page-header-bg.jpg';
import moment from 'moment-jalaali';

const convertToPersianDate = (date) => {
  return moment(date).format('jYYYY/jMM/jDD HH:mm:ss');
};

const PaymentStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authority = queryParams.get('Authority');
  const status = queryParams.get('Status');
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (authority && status) {
      verifyPayment(authority, status)
        .then((data) => {
          setPaymentStatus(data.payment_status); // Assuming this is the status returned
          setOrderDetails(data);
        })
        .catch((error) => console.error("Error verifying payment:", error));
    }
  }, [authority, status]);

  const renderPaymentStatus = (status) => {
    switch (status) {
        case 'paid':
            return 'پرداخت شده';
        case 'canceled':
            return 'لغو شده';
        case 'pending':
            return 'در انتظار';
        case 'failed':
            return 'ناموفق';
      default:
        return 'وضعیت نامشخص';
    }
  };

  return (
  <>
      <HeaderSection />
      <div className="page-content">
        <div className="page-header text-center" style={{ backgroundImage: `url(${PaymentHeader})` }}>
          <div className="container">
            <h1 className="page-title">
            {
                paymentStatus === 'paid' ? 'پرداخت موفق' :
                paymentStatus === 'canceled' ? 'پرداخت لغو شده' :
                paymentStatus === 'failed' ? 'پرداخت ناموفق' :
                paymentStatus === 'pending' ? 'در انتظار' : 'وضعیت نامشخص'
            }
            </h1>
          </div>
        </div>
        <BreadCrumb />
        <div className="container">
          {paymentStatus && (
            <div>
              <p>وضعیت پرداخت: {renderPaymentStatus(paymentStatus)}</p>
              {orderDetails && (
                <div>
                    <p>تاریخ : {convertToPersianDate(orderDetails.payment_date)}</p>
                    <p>کد سفارش: 
                        <Link to={`/orders/${orderDetails.order_code}`}>{orderDetails.order_code}</Link>
                    </p>
                    <p>کد ارجاع تراکنش: {orderDetails.ref_id}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentStatus;
