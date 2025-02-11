import { Link } from "react-router-dom";
import styles from './css/oderdetail.module.css';

const OrderProducts = ({ order }) => {
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

  const getStatusBadgeClass = (status) => {
    const badgeClasses = {
      canceled: styles.badgeCanceled,
      successful: styles.badgeSuccessful,
      pending: styles.badgePending,
      delivered: styles.badgeDelivered,
      returned: styles.badgeReturned,
    };
    return badgeClasses[status] || styles.badgeSecondary;
  };

  const calculateTotalPrice = (items, shipmentPrice) => {
    const itemsTotal = items.reduce((total, item) => {
      const price = parseFloat(item.product_price) || 0;
      const quantity = parseInt(item.quantity, 10) || 1;
      return total + price * quantity;
    }, 0);
    return itemsTotal + shipmentPrice;
  };

  const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }

  return (
    <>
      <div className={`container mt-5 ${styles.orderDetailContainer}`}>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="mb-4">
              <h3 className={`${styles.heading} text-center text-success mb-4`}>جزئیات سفارش</h3>
              <div className={`card shadow-lg mt-4 border-0 rounded-5 mb-4 ${styles.card}`}>
              <div className={`card-body p-4 ${styles.cardBody}`}>
                <h5 className={`${styles.orderInfoHeading} mb-4 text-dark`}>اطلاعات سفارش</h5>
                <div className="d-flex justify-content-between mb-3">
                  <strong>کد سفارش:</strong> <span>{toPersianNumbers(order.order_code)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>تاریخ:</strong>{" "}
                  {toPersianNumbers(formatTime(order.created_at_time))} {toPersianNumbers(order.created_at_date)} 
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>وضعیت سفارش:</strong>
                  <span
                    className={`${getStatusBadgeClass(order.status)} badge-pill`}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {getStatusInPersian(order.status)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 ">
                  <strong>کد پیگیری:</strong> 
                  <span>{order.payment.transaction_ref_id ? toPersianNumbers(order.payment.transaction_ref_id) : 'فاقد کد پیگیری'}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <strong>نوع پرداخت:</strong> <span>{order.payment_type === 'cash' ? 'نقد' : 'خرید اعتباری'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>هزینه ارسال:</strong>{" "}
                  <span>{toPersianNumbers(order.shipment_price_amount)} تومان</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>مجموع قیمت:</strong>{" "}
                  <span>{formatPrice(calculateTotalPrice(order.items, order.shipment_price))} تومان</span>
                </div>
              </div>
            </div>
              <div className={`card shadow-lg border-0 rounded-5 ${styles.card}`}>
                <div className={`card-body p-4 ${styles.cardBody}`}>
                  {order.items.map((item) => (
                    <div className={`d-flex flex-column flex-md-row mb-2 border-bottom pb-7 ${styles.itemRow}`} key={item.id}>
                      <div className={`col-6 col-md-3 ${styles.productImageWrapper}`}>
                        <figure className={`${styles.productMedia}`}>
                          <Link to={`/product/${item.product}`}>
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className={`img-fluid rounded-3 shadow-sm ${styles.productImage}`}
                            />
                          </Link>
                        </figure>
                      </div>
                      <div className={`col-md-12 d-flex flex-column justify-content-between left-0 ${styles.productDetails}`}>
                        <div className={`${styles.productBody}`} style={{ maxWidth: '400px' }}>
                          <div className={styles.orderSummary}>
                            <div className="d-flex justify-content-between">
                              <strong>نام محصول:</strong>
                              <Link to={`/product/${item.product}`}>
                                <h5 className={`${styles.productName} text-primary`}>{item.product_name}</h5>
                              </Link>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>قیمت:</strong>
                              <span>{formatPrice(item.product_price)} تومان</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>فروشنده:</strong> <span>{item.product_seller}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>تعداد:</strong> <span>{formatPrice(item.quantity)}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-3">
                            <strong>رنگ:</strong>
                            <p
                              style={{
                                display: "inline-block",
                                width: "24px",
                                height: "24px",
                                backgroundColor: item.color.color_hex,
                                border: "2px solid #dbdbdb",
                                borderRadius: "50%",
                                marginLeft: "5px",
                              }}
                            ></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProducts;
