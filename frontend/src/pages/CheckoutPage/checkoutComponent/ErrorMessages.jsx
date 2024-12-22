const ErrorMessages = ({ errorMessages }) => {
    return (
      <>
        {errorMessages.cartEmpty && <div className="alert alert-danger error-message">سبد خرید شما خالی است.</div>}
        {errorMessages.shippingEmpty && <div className="alert alert-danger error-message">لطفاً یک روش ارسال انتخاب کنید.</div>}
      </>
    );
  };
  
  export default ErrorMessages;
  