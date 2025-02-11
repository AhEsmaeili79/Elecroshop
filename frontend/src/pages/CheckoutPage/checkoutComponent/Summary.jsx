import { Link } from "react-router-dom";

const Summary = ({ cartItems, selectedShipping }) => {
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  function formatPrice(price) {
      const formattedPrice = price.toLocaleString();
      
      const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
      return persianNumerals;
  }

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
                    className="rounded-full object-cover p-4"
                    style={{ width: "100px", height: "100px" }}
                  />
                </Link>
              </td>
              <td>{formatPrice(item.total_price)} تومان</td>
            </tr>
          ))}
          <tr className="summary-total">
            <td>مجموع:</td>
            <td>{formatPrice(getTotalPrice())} تومان</td>
          </tr>
          {selectedShipping && (
            <tr className="summary-shipping">
              <td>هزینه ارسال:</td>
              <td>{selectedShipping.title} {formatPrice(selectedShipping.price)} تومان</td>
            </tr>
          )}
          <tr className="summary-total">
            <td>مجموع نهایی:</td>
            <td>
              {formatPrice(getTotalPrice() + (selectedShipping ? selectedShipping.price : 0))} تومان
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
