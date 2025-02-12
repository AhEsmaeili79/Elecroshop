const toPersianNumerals = (number) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
};

const QuantityInput = ({ quantity, setQuantity }) => {
  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^\d]/g, ''); 
    setQuantity(Math.max(1, Math.min(3, Number(numericValue))));
  };

  return (
    <div className="product-details-quantity" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="quantity-input" style={{ display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          className="btn-decrement"
          onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
          style={{
            backgroundColor: 'transparent',
            padding: '5px 10px',
            cursor: 'pointer',
            color:'#5d5656',
            fontSize: '17px',
            marginRight: '10px', 
            transition: 'color 0.3s ease, border-color 0.3s ease', 
          }}
          onMouseEnter={(e) => e.target.style.color = '#007BFF'}  
          onMouseLeave={(e) => e.target.style.color = 'black'}   
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
          style={{
            textAlign: 'center',
            border: '1px solid #ccc',
            padding: '5px 10px',
            width: '50px', 
            fontSize: '18px',
            outline: 'none',
          }}
        />
        <button
          type="button"
          className="btn-increment"
          onClick={() => setQuantity((prevQuantity) => Math.min(10, prevQuantity + 1))}
          style={{
            backgroundColor: 'transparent',
            padding: '5px 10px',
            color:'#5d5656',
            cursor: 'pointer',
            fontSize: '17px',
            marginLeft: '10px', 
            transition: 'color 0.3s ease, border-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.color = '#007BFF'}  
          onMouseLeave={(e) => e.target.style.color = 'black'}  
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
