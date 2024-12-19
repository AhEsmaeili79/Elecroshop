import BreadCrumb from "../Header/Breadcrumb/BreadCrumb";
import CheckoutForm from "./Components/CheckoutForm";
import ChekcoutHeader from "./Components/checkoutheader";

const Body = () => {
    return(
        <>
        <div className="page-content">
            <ChekcoutHeader />
            <BreadCrumb />
        </div>
        <div className="page-content">
            	<div className="checkout">
	                <div className="container">
                        <div className="checkout-discount">
            				<form action="#">
        						<input type="text" className="form-control" required id="checkout-discount-input"/>
            					<label htmlFor="checkout-discount-input" className="text-truncate">Have a coupon? <span>Click here to enter your code</span></label>
            				</form>
            			</div>
                        <CheckoutForm/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Body;