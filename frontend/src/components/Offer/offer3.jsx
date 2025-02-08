import CountdownTimer from "../Countdown/Countdown";
 
import bg1 from "../../assets/images/demos/demo-4/deal/bg-1.jpg";
import bg2 from "../../assets/images/demos/demo-4/deal/bg-2.jpg";

const DealsOutlet = () => {
    return (
        <div className="container">
            <div className="heading text-center mb-3">
                <h2 className="title">تخفیف‌ها و فروشگاه‌ها</h2>
                <p className="title-desc">تخفیف‌های امروز و بیشتر</p>
            </div>

            <div className="row">
                <div className="col-lg-6 deal-col">
                    <div className="deal" style={{ backgroundImage: `url(${bg1})` }}>
                        <div className="deal-top">
                            <h2>تخفیف روز.</h2>
                            <h4>مقدار محدود.</h4>
                        </div>

                        <div className="deal-content">
                            <h3 className="product-title"><a href="product.html">اسپیکر هوشمند خانگی با دستیار گوگل</a></h3>

                            <div className="product-price">
                                <span className="new-price">۴۲۹۰۰۰ تومان</span>
                                <span className="old-price">قبلاً ۵۲۹۰۰۰ </span>
                            </div>

                            <a href="product.html" className="btn btn-link">
                                <span>خرید کن</span><i className="icon-long-arrow-right"></i>
                            </a>
                        </div>

                        <div className="deal-bottom">
                            <div className="deal-countdown daily-deal-countdown" data-until="+10h">
                            <CountdownTimer/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 deal-col">
                    <div className="deal" style={{ backgroundImage: `url(${bg2})` }}>
                        <div className="deal-top">
                            <h2>پیشنهادات اختصاصی شما.</h2>
                            <h4>برای دیدن تخفیف‌های شگفت‌انگیز وارد شوید.</h4>
                        </div>

                        <div className="deal-content">
                            <h3 className="product-title"><a href="product.html">پد شارژ وایرلس تایید شده برای آیفون / اندروید</a></h3>

                            <div className="product-price">
                            <span className="new-price">۷۳۴۰۰۰ تومان</span>
                            </div>

                            <a href="login.html" className="btn btn-link">
                                <span>وارد شوید و پول صرفه‌جویی کنید</span><i className="icon-long-arrow-right"></i>
                            </a>
                        </div>

                        <div className="deal-bottom">
                            <div className="deal-countdown daily-deal-countdown" data-until="+10h">
                            <CountdownTimer/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="more-container text-center mt-1 mb-5">
                <a href="/product" className="btn btn-outline-dark-2 btn-round btn-more">
                    <span>خرید بیشتر از تخفیف‌های فروشگاه</span><i className="icon-long-arrow-right"></i>
                </a>
            </div>
        </div>
    );
};

export default DealsOutlet;
