// src/components/Product/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from './api';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductDetails(productId);
        setProduct(data);
      } catch (error) {
        setError('Failed to fetch product details.');
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    getProductDetails();
  }, [productId]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-detail-container">
      <h1 className="product-name">{product.name}</h1>
      <img src={product.main_photo} alt={product.name} className="product-image" />
      <p className="product-price">Price: ${product.price}</p>
      <p className="product-count">Available Count: {product.count}</p>
      <p className="product-model">Model: {product.model}</p>
      <p className="product-description">Description: {product.description}</p>
      {/* Add any other product details you wish to display */}
    </div>
  );
};

export default ProductDetail;
