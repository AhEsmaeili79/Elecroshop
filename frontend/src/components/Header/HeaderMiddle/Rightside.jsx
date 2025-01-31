import React from 'react';
import Cart from '../HeaderHomePage/Cart';
import SearchToggle from '../HeaderHomePage/SearchToggle';

const compareProducts = [
  { name: 'Blue Night Dress', link: 'product.html' },
  { name: 'White Long Skirt', link: 'product.html' },
];

const cartItems = [
  {
    name: 'Beige knitted elastic runner shoes',
    link: 'product.html',
    quantity: 1,
    price: 84.0,
    imageUrl: 'assets/images/products/cart/product-1.jpg',
  },
  {
    name: 'Blue utility pinafore denim dress',
    link: 'product.html',
    quantity: 1,
    price: 76.0,
    imageUrl: 'assets/images/products/cart/product-2.jpg',
  },
];

const RightSide = () => (
  <div className="header-right">
    <SearchToggle />
    <CompareDropdown products={compareProducts} />
    <Cart/>
  </div>
);


const CompareDropdown = ({ products }) => (
  <div className="dropdown compare-dropdown">
    <a href="#" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Compare Products">
      <i className="icon-random"></i>
    </a>
    <div className="dropdown-menu dropdown-menu-right">
      <ul className="compare-products">
        {products.map((product, index) => (
          <li key={index} className="compare-product">
            <a href="#" className="btn-remove" title="Remove Product"><i className="icon-close"></i></a>
            <h4 className="compare-product-title">
              <a href={product.link}>{product.name}</a>
            </h4>
          </li>
        ))}
      </ul>
      <div className="compare-actions">
        <a href="#" className="action-link">Clear All</a>
        <a href="#" className="btn btn-outline-primary-2"><span>Compare</span><i className="icon-long-arrow-right"></i></a>
      </div>
    </div>
  </div>
);




export default RightSide;
