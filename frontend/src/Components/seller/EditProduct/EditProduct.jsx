// src/Components/Seller/EditProduct/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, updateProduct, deleteProduct } from '../../api/product';
import EditProductForm from './EditProductForm';
import ErrorMessage from './ErrorMessage';
import './css/EditProduct.css';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Error loading product details.");
      }
    };
    loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      alert("Product deleted successfully.");
      navigate('/seller/products');
    } catch (err) {
      setError('Error deleting product.');
      console.error(err);
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="edit-product-container">
      <h1 className='title'>Edit Product</h1>
      {error && <ErrorMessage message={error} />}
      <EditProductForm 
        product={product} 
        onDelete={handleDelete} 
        onUpdate={(formData) => {
          updateProduct(productId, formData)
            .then(() => {
              alert("Product updated successfully.");
              navigate('/seller/products');
            })
            .catch(err => setError("Error updating product."));
        }}
      />
    </div>
  );
};

export default EditProduct;
