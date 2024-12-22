import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { fetchShippingOptions } from '../../../api/shipment'; // Import the API call function

const CartSummary = ({ cartItems, totalPrice }) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingPrice, setShippingPrice] = useState(0.0);
  const [selectedShipping, setSelectedShipping] = useState(null); // Track the selected shipping option
  const [finalTotal, setFinalTotal] = useState(totalPrice);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const getShippingOptions = async () => {
      const options = await fetchShippingOptions();
      setShippingOptions(options); // Set the fetched shipping options to state
    };

    getShippingOptions();
  }, []);

  useEffect(() => {
    // Recalculate final total when cartItems or shipping price change
    setFinalTotal(totalPrice + shippingPrice);
  }, [totalPrice, shippingPrice]);

  const handleShippingChange = (event) => {
    const selected = shippingOptions.find(
      (option) => option.id === parseInt(event.target.id) // Convert to number if necessary
    );
    if (selected) {
      setSelectedShipping(selected);
      setShippingPrice(selected.price);
    }
  };

  const handleCheckoutClick = () => {
    // Save the selected shipping option in localStorage
    if (selectedShipping) {
      localStorage.setItem('selectedShipping', JSON.stringify(selectedShipping));
    }
    navigate('/checkout'); // Use navigate instead of history.push
  };

  const isCheckoutDisabled = cartItems.length === 0 || !selectedShipping;

  return (
    <aside className="col-lg-3">
      <div className="summary summary-cart">
        <h3 className="summary-title">جمع سبد خرید</h3>
        <table className="table table-summary">
          <tbody>
            <tr className="summary-subtotal">
              <td>مجموع موقت:</td>
              <td>${totalPrice}</td>
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
                <td>${option.price}</td>
              </tr>
            ))}

            <tr className="summary-total">
              <td>مجموع نهایی:</td>
              <td>${finalTotal}</td>
            </tr>
          </tbody>
        </table>

        <button
          className="btn btn-outline-primary-2 btn-order btn-block"
          onClick={handleCheckoutClick} // Trigger the function to save and navigate
          disabled={isCheckoutDisabled} // Disable button conditionally
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
