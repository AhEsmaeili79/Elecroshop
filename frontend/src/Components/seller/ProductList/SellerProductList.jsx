// src/Components/Seller_section/SellerProductList/SellerProductList.jsx
import React, { useEffect, useState } from 'react';
import { fetchSellerProducts } from '../../api/product';
import ProductCard from './ProductCard';
import ErrorMessage from './ErrorMessage';
import './css/SellerProductList.css'; // Importing the CSS file

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchSellerProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch products:', err);
      }
    };
    getProducts();
  }, []);

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="product-list">
      <h1>Your Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default SellerProductList;
