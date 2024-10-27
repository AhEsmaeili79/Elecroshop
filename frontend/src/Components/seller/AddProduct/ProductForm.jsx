// src/Components/Seller_section/AddProduct/ProductForm.jsx
import React from 'react';

function ProductForm({ productData, handleChange, handleSubmit }) {
  return (
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
  );
}

export default ProductForm;
