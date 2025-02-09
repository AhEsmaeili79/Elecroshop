const CartBottom = () => {
	return (
	  <div className="bottom" >
		<div className="cart-bottom">
		  <div className="cart-discount">
			<form action="#">
			  <div className="input-group">
				<div className="input">
				<a href="/" className="btn btn-outline-dark-2 p-3">
				<i className="icon-arrow-right"></i> بازگشت
				</a>
				</div>
			  </div>
			</form>
		  </div>
		  <a href="/product" className="btn btn-outline-dark-2">
			<span>بروزرسانی سبد خرید</span>
			<i className="icon-refresh"></i>
		  </a>
		</div>
	  </div>
	);
};

export default CartBottom;
