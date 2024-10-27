// src/Components/Seller/EditProduct/EditProductForm.jsx
import React, { useState, useEffect } from 'react';

const EditProductForm = ({ product, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    count: product.count,
    model: product.model,
    main_photo: null,
  });

  // State to hold the image preview URL
  const [imagePreview, setImagePreview] = useState(product.main_photo);

  useEffect(() => {
    // Update the form data when the product prop changes
    setFormData({
      name: product.name,
      price: product.price,
      count: product.count,
      model: product.model,
      main_photo: null,
    });
    
    // Set the initial image preview to the current product's photo URL
    setImagePreview(product.main_photo);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, main_photo: file }));
    
    // Create a local URL for the selected file
    const fileURL = URL.createObjectURL(file);
    setImagePreview(fileURL); // Update the preview with the new file URL
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });
    onUpdate(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-product-form">
      <label className='title' htmlFor="main_photo">
        Current Image:
        {imagePreview && (
          <img src={imagePreview} alt={formData.name} className="product-image" />
        )}
      </label>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="input-field"
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
          className="input-field"
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
          className="input-field"
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
          className="input-field"
        />
      </label>
      <label>
        Main Photo:
        <input
          type="file"
          name="main_photo"
          onChange={handleFileChange}
          className="file-input"
        />
      </label>
      <div className="button-group">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onDelete} className="delete-button">Delete Product</button>
      </div>
    </form>
  );
};

export default EditProductForm;
