// src/Components/Seller_section/SellerProductList/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/seller/edit-product/${product.id}`} className="product-link">
      <div className="product-card">
        <img src={product.main_photo} alt={product.name} className="product-image" />
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">Price: ${product.price}</p>
        <p className="product-count">Count: {product.count}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
