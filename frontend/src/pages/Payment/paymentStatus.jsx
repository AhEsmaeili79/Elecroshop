import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { verifyPayment } from '../../api/paymentcallback';
import HeaderSection from '../../components/Header/HeaderMiddle/HeaderSection';
import Footer from '../../components/Footer/Footer';
import BreadCrumb from '../../components/Breadcrumb/BreadCrumb';
import PaymentHeader from '../../assets/images/page-header-bg.jpg';
import moment from 'moment-jalaali';

const convertToPersianNumber = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (digit) => persianNumbers[digit]);
};

const convertToPersianDate = (date) => {
  const persianDate = moment(date).format('jYYYY/jMM/jDD HH:mm:ss');
  return convertToPersianNumber(persianDate);
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
          setPaymentStatus(data.payment_status);
          setOrderDetails(data);
        })
        .catch((error) => console.error('Error verifying payment:', error));
    }
  }, [authority, status]);

  const renderPaymentStatus = (status) => {
    switch (status) {
      case 'paid':
        return 'پرداخت موفق';
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
        <div
          className="page-header text-center text-white py-5"
          style={{
            backgroundImage: `url(${PaymentHeader})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="container">
            <h1 className="display-4 font-weight-bold animated fadeIn">{paymentStatus === 'paid' ? 'پرداخت موفق' : paymentStatus === 'canceled' ? 'پرداخت لغو شده' : paymentStatus === 'failed' ? 'پرداخت ناموفق' : paymentStatus === 'pending' ? 'در انتظار' : 'وضعیت نامشخص'}</h1>
          </div>
        </div>

        <BreadCrumb />
        <div className="container py-5 rounded-lg">
          {paymentStatus && (
            <div className="card shadow-lg p-4 mb-5 border-0 rounded-lg">
              <div className="card-body">
                <h5 className="card-title text-center mb-4">
                  <span
                    className={`badge py-3 px-5 ${
                      paymentStatus === 'paid'
                        ? 'bg-success'
                        : paymentStatus === 'canceled'
                        ? 'bg-danger'
                        : paymentStatus === 'failed'
                        ? 'bg-warning'
                        : 'bg-info'
                    } text-white rounded-lg`}
                  >
                    {renderPaymentStatus(paymentStatus)}
                  </span>
                </h5>

                {orderDetails && (
                  <>
                    <p className="mb-3 text-muted">
                      <strong>تاریخ پرداخت: </strong>{' '}
                      {convertToPersianDate(orderDetails.payment_date)}
                    </p>

                    <p className="mb-3">
                      <strong>کد سفارش: </strong>
                      <Link
                        to={`/orders/${orderDetails.order_code}`}
                        className="text-decoration-none text-primary"
                      >
                        {convertToPersianNumber(orderDetails.order_code)}
                      </Link>
                    </p>

                    <p className="mb-4 text-muted">
                      <strong>کد ارجاع تراکنش: </strong>{' '}
                      {convertToPersianNumber(orderDetails.ref_id)}
                    </p>

                    <div className="text-center">
                      <Link
                        to={`/orders/${orderDetails.order_code}`}
                        className="btn btn-lg px-5 py-3 shadow-lg rounded-lg transition-all transform hover:scale-105 bg-primary text-white"
                      >
                        مشاهده جزئیات سفارش
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentStatus;
