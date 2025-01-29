import banner1Image from "../../assets/images/demos/demo-4/bg-1.jpg";
import offer2Image from "../../assets/images/demos/demo-4/camera.png";

const Offer2 = () => {
    return (
        <>
            <div className="container">
                <div className="cta cta-border mb-5" style={{ backgroundImage: `url(${banner1Image})` }}>
                    <img src={offer2Image} alt="دوربین" className="cta-img"/>
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="cta-content">
                                <div className="cta-text text-right text-white">
                                    <p>خرید پیشنهادات امروز <br/><strong>آسان و شگفت‌انگیز. HERO7 Black</strong></p>
                                </div>
                                <a href="/product" className="btn btn-primary btn-round"><span>همین حالا خرید کنید - ۴۲۹۰۰۰ تومان</span><i className="icon-long-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Offer2;
