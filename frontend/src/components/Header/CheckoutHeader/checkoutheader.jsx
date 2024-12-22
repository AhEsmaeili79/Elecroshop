import CheckoutHeader from '../../../assets/images/page-header-bg.jpg'

const ChekcoutHeader = () => {
    return (
        <div className="page-header text-center" style={{ backgroundImage: `url(${CheckoutHeader})` }}>
            <div className="container">
                <h1 className="page-title">پرداخت<span>فروشگاه</span></h1>
            </div>
        </div>
    );
};

export default ChekcoutHeader;
