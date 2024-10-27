// src/Components/Seller_section/AddProduct/AddProduct.jsx
import React, { useState } from 'react';
import { addProduct } from '../api/product';
import './css/AddProduct.css'; // Import the CSS file

function AddProduct() {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    count: '',
    model: '',
    main_photo: null,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setProductData({ ...productData, [name]: e.target.files[0] });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    try {
      const newProduct = await addProduct(formData);
      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      setProductData({
        name: '',
        price: '',
        count: '',
        model: '',
        main_photo: null,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Error adding product. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-product-container">
      {successMessage && <p className="message success">{successMessage}</p>}
      {errorMessage && <p className="message error">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="number"
          name="count"
          placeholder="Count"
          value={productData.count}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={productData.model}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="file"
          name="main_photo"
          onChange={handleChange}
          required
          className="file-input"
        />
        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
