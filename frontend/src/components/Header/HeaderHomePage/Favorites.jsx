import React from 'react';

const Favorites = () => {
    return (
        <div className="dropdown compare-dropdown">
            <a href="#" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static" title="Compare Products" aria-label="Compare Products">
                <div className="icon"><i className="icon-random"></i></div>
                <p>Compare</p>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
                <ul className="compare-products">
                    <li className="compare-product">
                        <a href="#" className="btn-remove" title="Remove Product"><i className="icon-close"></i></a>
                        <h4 className="compare-product-title"><a href="product.html">Blue Night Dress</a></h4>
                    </li>
                </ul>
                <div className="compare-actions">
                    <a href="#" className="action-link">Clear All</a>
                    <a href="#" className="btn btn-outline-primary-2"><span>Compare</span><i className="icon-long-arrow-right"></i></a>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
