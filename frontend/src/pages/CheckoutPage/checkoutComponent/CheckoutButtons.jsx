const CheckoutButtons = ({ paymentType, setPaymentType, errorMessages }) => {
    return (
      <div>
        <div className="form-group">
          <label>نوع پرداخت *</label>
          <select
            className="form-control"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="credit_card">کارت اعتباری</option>
            <option value="cash">نقدی</option>
          </select>
        </div>
  
        <button
          type="submit"
          className="btn btn-outline-primary-2 btn-order btn-block"
          disabled={errorMessages.cartEmpty || errorMessages.shippingEmpty}
        >
          <span className="btn-text">ثبت سفارش</span>
          <span className="btn-hover-text">ادامه به تسویه حساب</span>
        </button>
      </div>
    );
  };
  
  export default CheckoutButtons;
  