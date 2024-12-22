import React, { useState } from 'react';
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import CheckoutForm from "./CheckoutForm";
import ChekcoutHeader from "../../components/Header/CheckoutHeader/checkoutheader";
import './css/CheckoutForm.css';

const Body = () => {
    const [discountCode, setDiscountCode] = useState(""); // State to handle input

    const handleInputChange = (e) => {
        setDiscountCode(e.target.value); // Update the discount code value
    };

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
        						<input 
                                  type="text" 
                                  className="form-control" 
                                  required 
                                  id="checkout-discount-input"
                                  value={discountCode}
                                  onChange={handleInputChange}
                                  placeholder=" "  /* Ensure the placeholder triggers label fade */
                                  autoFocus={false} /* Optional: only auto-focus if needed */
                                />
            					<label htmlFor="checkout-discount-input" className="text-truncate">
                                  کد تخفیف دارید؟ <span>کد تخفیف خود را اینجا وارد کنید</span>
                                </label>
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
