import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { fetchShippingOptions } from '../../../api/shipment'; 

const CartSummary = ({ cartItems, totalPrice }) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingPrice, setShippingPrice] = useState(0.0);
  const [selectedShipping, setSelectedShipping] = useState(null); 
  const [finalTotal, setFinalTotal] = useState(totalPrice);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getShippingOptions = async () => {
      const options = await fetchShippingOptions();
      setShippingOptions(options);
    };

    getShippingOptions();
  }, []);

  function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }

  useEffect(() => {
    setFinalTotal(totalPrice + shippingPrice);
  }, [totalPrice, shippingPrice]);

  const handleShippingChange = (event) => {
    const selected = shippingOptions.find(
      (option) => option.id === parseInt(event.target.id) 
    );
    if (selected) {
      setSelectedShipping(selected);
      setShippingPrice(selected.price);
    }
  };

  const handleCheckoutClick = () => {
    if (selectedShipping) {
      localStorage.setItem('selectedShipping', JSON.stringify(selectedShipping));
    }
    navigate('/checkout'); 
  };

  const isCheckoutDisabled = cartItems.length === 0 || !selectedShipping;

  if (cartItems.length === 0) {
    return null; 
  }

  return (
    <aside className="col-lg-3 summary">
      <div className="summary summary-cart">
        <h3 className="summary-title">جمع سبد خرید</h3>
        <table className="table table-summary">
          <tbody>
            <tr className="summary-subtotal">
              <td>مجموع موقت:</td>
              <td>{formatPrice(totalPrice)} تومان</td>
            </tr>
            <tr className="summary-shipping">
              <td>هزینه حمل و نقل:</td>
              <td>&nbsp;</td>
            </tr>

            {shippingOptions.map((option) => (
              <tr className="summary-shipping-row" key={option.id}>
                <td>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id={option.id}
                      name="shipping"
                      className="custom-control-input"
                      onChange={handleShippingChange}
                    />
                    <label className="custom-control-label" htmlFor={option.id}>
                      {option.title}
                    </label>
                  </div>
                </td>
                <td>{formatPrice(option.price)} تومان</td>
              </tr>
            ))}

            <tr className="summary-total">
              <td>مجموع نهایی:</td>
              <td>{formatPrice(finalTotal)} تومان</td>
            </tr>
          </tbody>
        </table>

        <button
          className="btn btn-outline-primary-2 btn-order btn-block"
          onClick={handleCheckoutClick} 
          disabled={isCheckoutDisabled} 
        >
          ادامه به صفحه پرداخت
        </button>
      </div>

      <Link to="/" className="btn btn-outline-dark-2 btn-block mb-3">
        <span>ادامه خرید</span>
        <i className="icon-refresh"></i>
      </Link>
    </aside>
  );
};

export default CartSummary;
