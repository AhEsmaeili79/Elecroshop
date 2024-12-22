import bgImage from "../../../assets/images/page-header-bg.jpg";
import BreadCrumb from "../../Breadcrumb/BreadCrumb";

const CartHeader = () => {
    return (
      <>
        <div className="page-header text-center" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="container">
                <h1 className="page-title">سبد خرید<span>فروشگاه</span></h1>
            </div>
        </div>
        <BreadCrumb/>
      </>
    );
};

export default CartHeader;
