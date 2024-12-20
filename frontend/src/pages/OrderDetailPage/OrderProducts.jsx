import { Link } from "react-router-dom";

const OrderProducts = ({order}) => {
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
    return (
        <>
            <div className="col-lg-9">
              <div className="products mb-3">
                {order.items.map((item) => (
                  <div className="product product-list" key={item.id}>
                    <div className="row">
                      <div className="col-6 col-lg-3">
                        <figure className="product-media">
                          <Link to={`/product/${item.product}`}>
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="product-image"
                            />
                          </Link>
                        </figure>
                      </div>

                    <div className="col-6 col-lg-3 order-lg-last">
                      <div className="product-list-action">
                        <div className="product-price">${item.product_price}</div>
                        
                        <div className="product-action">
                          <a href="popup/quickView.html" className="btn-product btn-quickview" title="Quick view">
                            <span>quick view</span>
                          </a>
                          <a href="#" className="btn-product btn-compare" title="Compare">
                            <span>compare</span>
                          </a>
                        </div>
                        <a href="#" className="btn-product btn-cart">
                          <span>add to cart</span>
                        </a>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="product-body product-action-inner">
                        <div className="product-cat">
                          <Link to={`/product/${item.product}`}><h5>{item.product_name}</h5></Link>
                        </div>
                        <div className="product-cat">
                          <h5>{item.quantity}</h5>
                        </div>
                        <div className="product-cat">
                          <h5>{item.product_seller}</h5>
                        </div>
                        <div className="product-nav product-nav-thumbs">
                          <a
                            style={{
                              display: "inline-block",
                              width: "24px",
                              height: "24px",
                              backgroundColor: item.color.color_hex,
                              border:"2px solid #dbdbdb",
                              borderRadius: "50%",
                              cursor: "pointer",
                              marginLeft: "5px",
                            }}>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="d-flex justify-content-between">
                <strong>Order Code:</strong> <span>{order.order_code}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Payment Type:</strong> <span>{order.payment_type}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Shipment Price:</strong> <span>${order.shipment_price_amount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Total Price:</strong> <span>${calculateTotalPrice(order.items, order.shipment_price)}</span>
              </div>
            </div>
            </div>
        </>
    );
};

export default OrderProducts;