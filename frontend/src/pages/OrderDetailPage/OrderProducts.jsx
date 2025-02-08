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
      <div className="col-lg-9">
        <div className="products mb-3">
          {order.items.map((item) => (
            <div className="product product-list" key={item.id}>
              <div className="row">
                <div className="col-6 col-lg-3">
                  <figure className="product-media center">
                    <Link to={`/product/${item.product}`}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="product-image"
                      />
                    </Link>
                  </figure>
                </div>
                <div className="col-lg-6">
                  <div className="product-body product-action-inner">
                    <div className="order-summary">
                      <div className="d-flex justify-content-between">
                        <strong>نام محصول:</strong>
                        <Link to={`/product/${item.product}`}>
                          <h5>{item.product_name}</h5>
                        </Link>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>قیمت:</strong>{" "}
                        <span>{toPersianNumbers(item.product_price)} تومان</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>فروشنده:</strong> <span>{item.product_seller}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>تعداد:</strong> <span>{toPersianNumbers(item.quantity)}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
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
            </div>
          ))}
        </div>
        <div className="order-summary">
          <div className="d-flex justify-content-between">
            <strong>کد سفارش:</strong> <span>{toPersianNumbers(order.order_code)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>تاریخ:</strong>{" "}
            <span>{toPersianNumbers(convertToPersianDate(order.payment.created_at))}</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>وضعیت سفارش:</strong> <span>{getStatusInPersian(order.status)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>کد پیگیری:</strong> <span>{toPersianNumbers(order.payment.transaction_ref_id)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>نوع پرداخت:</strong> <span>{order.payment_type === 'cash' ? 'نقد' : 'خرید اعتباری'}</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>هزینه ارسال:</strong>{" "}
            <span>{toPersianNumbers(order.shipment_price_amount)} تومان</span>
          </div>
          <div className="d-flex justify-content-between">
            <strong>مجموع قیمت:</strong>{" "}
            <span>{toPersianNumbers(calculateTotalPrice(order.items, order.shipment_price))} تومان</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProducts;
