// src/Components/Seller_section/AddProduct/AddProduct.jsx
import React, { useState } from 'react';
import { addProduct } from '../api/product';

function AddProduct() {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    count: '',
    model: '',
    main_photo: null, // For file upload
  });
  
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

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

    // Append all product data to formData
    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    try {
      const newProduct = await addProduct(formData);
      console.log('Product added:', newProduct);
      setSuccessMessage('Product added successfully!'); // Set success message
      setErrorMessage(''); // Clear error message
      // Optionally, clear the form data after successful submission
      setProductData({
        name: '',
        price: '',
        count: '',
        model: '',
        main_photo: null,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Error adding product. Please try again.'); // Set error message
      setSuccessMessage(''); // Clear success message
    }
  };

  return (
    <div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required // Mark as required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required // Mark as required
        />
        <input
          type="number"
          name="count"
          placeholder="Count"
          value={productData.count}
          onChange={handleChange}
          required // Mark as required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={productData.model}
          onChange={handleChange}
          required // Mark as required
        />
        <input
          type="file"
          name="main_photo"
          onChange={handleChange}
          required // Mark as required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
