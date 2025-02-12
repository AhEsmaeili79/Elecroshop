import  { useState } from 'react';

const QuantitySelector = ({ initialQuantity, handleQuantityChange, handleRemoveFromCart }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const toPersianNumbers = (number) => {
    // Function to convert the number to Persian numbers
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number
      .toString()
      .split('')
      .map(digit => persianDigits[digit] || digit)
      .join('');
  };

  const decreaseQuantity = (e) => {
    e.preventDefault();
    if (quantity === 1) {
      handleRemoveFromCart();
    } else {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleQuantityChange(newQuantity);
    }
  };

  const increaseQuantity = (e) => {
    e.preventDefault();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleQuantityChange(newQuantity);
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#fff', borderBottom: '2px solid #ddd', padding: '10px' }}>
      <button
        onClick={decreaseQuantity}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #007bff',
          borderRadius: '10%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#007bff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        title="کاهش تعداد"
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e6f7ff';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <span>-</span>
      </button>

      <span style={{ margin: '0 20px', fontSize: '15px', color: '#333' }}>
        {toPersianNumbers(quantity)}
      </span>

      <button
        onClick={increaseQuantity}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #007bff',
          borderRadius: '10%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#007bff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        title="افزایش تعداد"
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e6f7ff';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <span>+</span>
      </button>
    </div>
  );
};

export default QuantitySelector;
