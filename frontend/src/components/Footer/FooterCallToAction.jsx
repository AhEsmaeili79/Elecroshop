const FooterCallToAction = ({ bgImage }) => (
  <div className="cta bg-image bg-dark pt-4 pb-5 mb-0" style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="cta-heading text-center">
            <h3 className="cta-title text-white">جدیدترین تخفیف‌ها را دریافت کنید</h3>
            <p className="cta-desc text-white">
              و <span className="font-weight-normal">۲۰ دلار کوپن</span> برای خرید اول دریافت کنید
            </p>
          </div>
          <form action="#">
            <div className="input-group input-group-round">
              <input
                type="email"
                className="form-control form-control-white"
                placeholder="آدرس ایمیل خود را وارد کنید"
                aria-label="آدرس ایمیل"
                required
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  <span>اشتراک‌گذاری</span>
                  <i className="icon-long-arrow-right"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default FooterCallToAction;
