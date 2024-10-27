// src/Components/Seller/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, updateProduct, deleteProduct } from '../api/product';

const EditProduct = () => {
  const { productId } = useParams();  
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    count: '',
    model: '',
    main_photo: null,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProduct(productId); // Fetch the specific product by ID
        setProduct(productData);
        setFormData({
          name: productData.name,
          price: productData.price,
          count: productData.count,
          model: productData.model,
          main_photo: productData.main_photo,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Error loading product details.");
      }
    };

    loadProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, main_photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });

    try {
      await updateProduct(productId, updatedFormData);
      alert("Product updated successfully.");
      navigate('/seller/products'); // Redirect to product list
    } catch (error) {
      console.error("Failed to update product:", error);
      setError("Error updating product.");
    }
  };

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
    <div>
      <h1>Edit Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
      <label htmlFor="">
          Main image:
        <img src={formData.main_photo} alt={formData.name} className="product-image" />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Count:
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
          />
        </label>
      
        <label>
          Main Photo:
          <input
            type="file"
            name="main_photo"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleDelete}>Delete Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
