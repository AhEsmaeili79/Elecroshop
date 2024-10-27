// src/Components/Seller_section/AddProduct/AddProduct.jsx
import React, { useState } from 'react';
import { addProduct } from '../../api/product';
import ProductForm from './ProductForm';
import Message from './Message';
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
      await addProduct(formData);
      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Error adding product. Please try again.');
      setSuccessMessage('');
    }
  };

  const resetForm = () => {
    setProductData({
      name: '',
      price: '',
      count: '',
      model: '',
      main_photo: null,
    });
  };

  return (
    <div className="add-product-container">
      <Message successMessage={successMessage} errorMessage={errorMessage} />
      <ProductForm productData={productData} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
}

export default AddProduct;
