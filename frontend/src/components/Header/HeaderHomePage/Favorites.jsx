const Favorites = () => {
    return (
        <div className="dropdown compare-dropdown">
            <a href="#" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static" title="مقایسه محصولات" aria-label="مقایسه محصولات">
                <div className="icon"><i className="icon-random"></i></div>
                <p>مقایسه</p>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
                <ul className="compare-products">
                    <li className="compare-product">
                        <a href="#" className="btn-remove" title="حذف محصول"><i className="icon-close"></i></a>
                        <h4 className="compare-product-title"><a href="product.html">پیراهن شب آبی</a></h4>
                    </li>
                </ul>
                <div className="compare-actions">
                    <a href="#" className="action-link">حذف همه</a>
                    <a href="#" className="btn btn-outline-primary-2"><span>مقایسه</span><i className="icon-long-arrow-right"></i></a>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
