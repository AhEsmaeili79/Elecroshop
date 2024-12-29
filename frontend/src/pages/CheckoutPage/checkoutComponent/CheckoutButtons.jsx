const CheckoutButtons = ({ paymentType, setPaymentType, errorMessages, paymentReady }) => {
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

      {
        paymentType === 'credit_card' && paymentReady ? (
          // Show the payment gateway button when conditions are met
          <button
            type="button"
            className="btn btn-outline-success btn-order btn-block btn-checkout" // Assuming this function is used to handle redirection
          >
            انتقال به درگاه پرداخت
          </button>
        ) : (
          // Show the order submit button when it's not a credit card or not ready for payment
          <button
            type="submit"
            className="btn btn-outline-primary-2 btn-order btn-block btn-checkout"
            disabled={errorMessages.cartEmpty || errorMessages.shippingEmpty}
          >
            <span className="btn-text">ثبت سفارش</span>
            <span className="btn-hover-text">ادامه به تسویه حساب</span>
          </button>
        )
      }

    </div>
  );
};

export default CheckoutButtons;
