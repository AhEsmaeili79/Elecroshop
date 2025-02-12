import { FaSpinner, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CheckoutButtons = ({ paymentType, setPaymentType, errorMessages, paymentReady, isProcessing }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      setIsButtonDisabled(true);
      const enableButton = async () => {
        await delay(2000); 
        setIsButtonDisabled(false);
      };
      enableButton();
    } else {
      setIsButtonDisabled(false);
    }
  }, [isProcessing]);

  return (
    <div>
      <div>
        <label>نوع پرداخت *</label>
        <select
          className="form-control rounded-lg pr-3 p-1"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          style={{cursor:'pointer'}}
        >
          <option value="credit_card">کارت اعتباری</option>
          <option value="cash">نقدی</option>
        </select>
      </div>

      {
        paymentType === 'credit_card' && paymentReady ? (
          <button
            type="button"
            className="btn btn-outline-success btn-order btn-block btn-checkout"
            disabled={isButtonDisabled || isProcessing}
          >
            {isProcessing ? (
              <FaSpinner className="fa-spin" />
            ) : (
              'انتقال به درگاه پرداخت'
            )}
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-outline-primary-2 btn-order btn-block btn-checkout"
            disabled={isButtonDisabled || errorMessages.cartEmpty || errorMessages.shippingEmpty || isProcessing}
          >
            {isProcessing ? (
              <FaSpinner className="fa-spin" />
            ) : (
              <>
                <span className="btn-text">ثبت سفارش<FaShoppingCart className='ml-2'/></span>
                <span className="btn-hover-text">ادامه به تسویه حساب<FaCreditCard className='ml-2'/></span>
              </>
            )}
          </button>
        )
      }
    </div>
  );
};

export default CheckoutButtons;
