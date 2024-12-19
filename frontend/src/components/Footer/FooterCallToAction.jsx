const FooterCallToAction = ({ bgImage }) => (
  <div className="cta bg-image bg-dark pt-4 pb-5 mb-0" style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="cta-heading text-center">
            <h3 className="cta-title text-white">Get The Latest Deals</h3>
            <p className="cta-desc text-white">
              and receive <span className="font-weight-normal">$20 coupon</span> for first shopping
            </p>
          </div>
          <form action="#">
            <div className="input-group input-group-round">
              <input
                type="email"
                className="form-control form-control-white"
                placeholder="Enter your Email Address"
                aria-label="Email Address"
                required
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  <span>Subscribe</span>
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
