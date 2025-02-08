const toPersianNumerals = (number) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
};

const QuantityInput = ({ quantity, setQuantity }) => {
  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^\d]/g, ''); 
    setQuantity(Math.max(1, Math.min(10, Number(numericValue))));
  };

  return (
    <div className="product-details-quantity">
      <div className="quantity-input">
        <button
          type="button"
          className="btn-decrement"
          onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
        >
          -
        </button>
        <input
          type="text"
          id="sticky-cart-qty"
          className="form-control"
          value={toPersianNumerals(quantity)}
          onChange={handleChange}
          min="1"
          max="10"
        />
        <button
          type="button"
          className="btn-increment"
          onClick={() => setQuantity((prevQuantity) => Math.min(10, prevQuantity + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
