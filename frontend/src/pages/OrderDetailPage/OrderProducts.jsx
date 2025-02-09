import { Link } from "react-router-dom";
import moment from 'moment-jalaali';

const convertToPersianDate = (date) => {
  return moment(date).format('jYYYY/jMM/jDD HH:mm:ss');
};

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
      canceled: 'text-danger',
      successful: 'text-success',
      pending: 'text-warning',
      delivered: 'text-primary',
      returned: 'text-info',
    };
    return badgeClasses[status] || 'text-secondary';
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

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-9 col-md-12">
            <div className="mb-4">
              <h3 className="text-center text-success mb-4">جزئیات سفارش</h3>
              <div className="card shadow-lg border-0 rounded-3">
                <div className="card-body p-4">
                  {order.items.map((item) => (
                    <div className="d-flex mb-4 border-bottom pb-4" key={item.id}>
                      <div className="col-6 col-lg-3">
                        <figure className="product-media">
                          <Link to={`/product/${item.product}`}>
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="img-fluid rounded shadow-sm"
                            />
                          </Link>
                        </figure>
                      </div>
                      <div className="col-lg-6">
                        <div className="product-body">
                          <div className="order-summary">
                            <div className="d-flex justify-content-between">
                              <strong>نام محصول:</strong>
                              <Link to={`/product/${item.product}`}>
                                <h5 className="text-primary">{item.product_name}</h5>
                              </Link>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>قیمت:</strong>
                              <span>{toPersianNumbers(item.product_price)} تومان</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>فروشنده:</strong> <span>{item.product_seller}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>تعداد:</strong> <span>{toPersianNumbers(item.quantity)}</span>
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

            <div className="card shadow-lg mt-4 border-0 rounded-3">
              <div className="card-body p-4">
                <h5 className="mb-4 text-dark">اطلاعات سفارش</h5>
                <div className="d-flex justify-content-between mb-3">
                  <strong>کد سفارش:</strong> <span>{toPersianNumbers(order.order_code)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>تاریخ:</strong>{" "}
                  <span>{toPersianNumbers(convertToPersianDate(order.payment.created_at))}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>وضعیت سفارش:</strong>
                  <span
                    className={`${getStatusBadgeClass(order.status)}`}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {getStatusInPersian(order.status)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
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
                  <span>{toPersianNumbers(calculateTotalPrice(order.items, order.shipment_price))} تومان</span>
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
