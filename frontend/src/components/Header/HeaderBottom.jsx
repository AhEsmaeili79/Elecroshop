import image from "../../assets/images/menu/banner-1.jpg";

const HeaderBottom = () => {
  return (
    <div className="header-bottom sticky-header">
      <div className="container">
        <div className="header-left"></div>
        <div className="header-center">
          <nav className="main-nav">
            <ul className="menu sf-arrows">
              <li className="megamenu-container active">
                <a href="/" className="">خانه</a>
              </li>
              <li>
                <a href="category.html" className="sf-with-ul">فروشگاه</a>
                <div className="megamenu megamenu-md">
                    <div className="row no-gutters">
                        <div className="col-md-8">
                            <div className="menu-col">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="menu-title">فروشگاه با نوار کناری</div>
                                        <ul>
                                            <li><a href="category-list.html">فروشگاه لیست</a></li>
                                            <li><a href="category-2cols.html">فروشگاه گرید ۲ ستون</a></li>
                                            <li><a href="category.html">فروشگاه گرید ۳ ستون</a></li>
                                            <li><a href="category-4cols.html">فروشگاه گرید ۴ ستون</a></li>
                                            <li><a href="category-market.html"><span>بازار فروشگاه<span className="tip tip-new">جدید</span></span></a></li>
                                        </ul>

                                        <div className="menu-title">فروشگاه بدون نوار کناری</div>
                                        <ul>
                                            <li><a href="category-boxed.html"><span>فروشگاه جعبه‌ای بدون نوار کناری<span className="tip tip-hot">داغ</span></span></a></li>
                                            <li><a href="category-fullwidth.html">فروشگاه تمام عرض بدون نوار کناری</a></li>
                                        </ul>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="menu-title">دسته‌بندی محصولات</div>
                                        <ul>
                                            <li><a href="product-category-boxed.html">دسته‌بندی محصولات جعبه‌ای</a></li>
                                            <li><a href="product-category-fullwidth.html"><span>دسته‌بندی محصولات تمام عرض<span className="tip tip-new">جدید</span></span></a></li>
                                        </ul>
                                        <div className="menu-title">صفحات فروشگاه</div>
                                        <ul>
                                            <li><a href="cart.html">سبد خرید</a></li>
                                            <li><a href="checkout.html">پرداخت</a></li>
                                            <li><a href="wishlist.html">لیست خواسته‌ها</a></li>
                                            <li><a href="dashboard.html">حساب کاربری من</a></li>
                                            <li><a href="#">کتاب نگاه</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="banner banner-overlay">
                                <a href="category.html" className="banner banner-menu">
                                    <img src={image} alt="بنر"/>

                                    <div className="banner-content banner-content-top">
                                        <div className="banner-title text-white">آخرین <br/>فرصت<br/><span><strong>فروش</strong></span></div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
              </li>
              <li>
                <a href="product.html" className="sf-with-ul">محصولات</a>
              </li>
              <li>
                <a href="#" className="sf-with-ul">برند ها</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
