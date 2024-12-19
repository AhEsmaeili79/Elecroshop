import React from 'react';
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
                <a href="index.html" className="sf-with-ul">Home</a>
              </li>
              <li>
                <a href="category.html" className="sf-with-ul">Shop</a>
                <div className="megamenu megamenu-md">
                    <div className="row no-gutters">
                        <div className="col-md-8">
                            <div className="menu-col">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="menu-title">Shop with sidebar</div>
                                        <ul>
                                            <li><a href="category-list.html">Shop List</a></li>
                                            <li><a href="category-2cols.html">Shop Grid 2 Columns</a></li>
                                            <li><a href="category.html">Shop Grid 3 Columns</a></li>
                                            <li><a href="category-4cols.html">Shop Grid 4 Columns</a></li>
                                            <li><a href="category-market.html"><span>Shop Market<span className="tip tip-new">New</span></span></a></li>
                                        </ul>

                                        <div className="menu-title">Shop no sidebar</div>
                                        <ul>
                                            <li><a href="category-boxed.html"><span>Shop Boxed No Sidebar<span className="tip tip-hot">Hot</span></span></a></li>
                                            <li><a href="category-fullwidth.html">Shop Fullwidth No Sidebar</a></li>
                                        </ul>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="menu-title">Product Category</div>
                                        <ul>
                                            <li><a href="product-category-boxed.html">Product Category Boxed</a></li>
                                            <li><a href="product-category-fullwidth.html"><span>Product Category Fullwidth<span className="tip tip-new">New</span></span></a></li>
                                        </ul>
                                        <div className="menu-title">Shop Pages</div>
                                        <ul>
                                            <li><a href="cart.html">Cart</a></li>
                                            <li><a href="checkout.html">Checkout</a></li>
                                            <li><a href="wishlist.html">Wishlist</a></li>
                                            <li><a href="dashboard.html">My Account</a></li>
                                            <li><a href="#">Lookbook</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="banner banner-overlay">
                                <a href="category.html" className="banner banner-menu">
                                    <img src={image} alt="Banner"/>

                                    <div className="banner-content banner-content-top">
                                        <div className="banner-title text-white">Last <br/>Chance<br/><span><strong>Sale</strong></span></div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
              </li>
              <li>
                <a href="product.html" className="sf-with-ul">Product</a>
                {/* Product submenu */}
              </li>
              <li>
                <a href="#" className="sf-with-ul">Pages</a>
                {/* Pages submenu */}
              </li>
              <li>
                <a href="blog.html" className="sf-with-ul">Blog</a>
              </li>
              <li>
                <a href="elements-list.html" className="sf-with-ul">Elements</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
