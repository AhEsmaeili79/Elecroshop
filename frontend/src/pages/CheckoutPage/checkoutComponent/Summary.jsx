import { Link } from "react-router-dom";

const Summary = ({ cartItems, selectedShipping }) => {
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  return (
    <div className="summary">
      <h3 className="summary-title">سفارش شما</h3>
      <table className="table table-summary">
        <thead>
          <tr>
            <th>محصول</th>
            <th>مجموع</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={`/product/${item.product.id}`}>
                  <img
                    src={item.product.main_photo}
                    alt={item.product.name}
                    className="checkout-item-image"
                  />
                </Link>
              </td>
              <td>{item.total_price} تومان</td>
            </tr>
          ))}
          <tr className="summary-total">
            <td>مجموع:</td>
            <td>{getTotalPrice()} تومان</td>
          </tr>
          {selectedShipping && (
            <tr className="summary-shipping">
              <td>هزینه ارسال:</td>
              <td>{selectedShipping.title} {selectedShipping.price} تومان</td>
            </tr>
          )}
          <tr className="summary-total">
            <td>مجموع نهایی:</td>
            <td>
              {getTotalPrice() + (selectedShipping ? selectedShipping.price : 0)} تومان
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
