// import { useState } from 'react';
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import CheckoutForm from "./CheckoutForm";
import ChekcoutHeader from "../../components/Header/CheckoutHeader/checkoutheader";
import './css/CheckoutForm.rtl.css';

const Body = () => {
    // const [discountCode, setDiscountCode] = useState(""); 

    // const handleInputChange = (e) => {
    //     setDiscountCode(e.target.value); 
    // };

    return(
        <>
        <div className="page-content" id='checkout'>
            <ChekcoutHeader />
            <BreadCrumb />
            <div className="checkout">
                <div className="container">
                    {/* <div className="checkout-discount">
                        <form action="#">
                            <input 
                                type="text" 
                                className="form-control" 
                                required 
                                id="checkout-discount-input"
                                value={discountCode}
                                onChange={handleInputChange}
                                placeholder=" " 
                                autoFocus={false} 
                            />
                            <label htmlFor="checkout-discount-input" className="text-truncate">
                                کد تخفیف دارید؟ <span>کد تخفیف خود را اینجا وارد کنید</span>
                            </label>
                        </form>
                    </div> */}
                    <CheckoutForm/>
                </div>
            </div>
        </div>
        </>
    );
};

export default Body;
