import React from "react";

const QuantityInput = ({ quantity, setQuantity }) => (
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
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Math.min(10, e.target.value)))}
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

export default QuantityInput;
