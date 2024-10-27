import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails, addProductToCart } from './api';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = async () => {
    try {
      await addProductToCart(product.id, quantity); // Send product.id and quantity
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert(error.message); // Show error message to the user
    }
  };

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

      {/* Quantity input */}
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetail;
