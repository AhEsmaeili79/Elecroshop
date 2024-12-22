const CartBottom = () => {
	return (
	  <div className="bottom" >
		<div className="cart-bottom">
		  <div className="cart-discount">
			<form action="#">
			  <div className="input-group">
				<input type="text" className="form-control" required placeholder="کد کوپن" />
				<div className="input-group-append">
				  <button className="btn btn-outline-primary-2" type="submit">
					<i className="icon-long-arrow-right"></i>
				  </button>
				</div>
			  </div>
			</form>
		  </div>
		  <a href="#" className="btn btn-outline-dark-2">
			<span>بروزرسانی سبد خرید</span>
			<i className="icon-refresh"></i>
		  </a>
		</div>
	  </div>
	);
};

export default CartBottom;
