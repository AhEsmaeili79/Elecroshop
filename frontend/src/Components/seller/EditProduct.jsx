// src/Components/Seller/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts, updateProduct, deleteProduct } from '../api/product';

const EditProduct = () => {
  const { productId } = useParams();  // Get the product ID from URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
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
        const productData = await fetchProducts(); // Fetch all products of the seller
        const currentProduct = productData.find((prod) => prod.id === parseInt(productId));

        if (currentProduct) {
          setProduct(currentProduct);
          setFormData({
            name: currentProduct.name,
            price: currentProduct.price,
            count: currentProduct.count,
            model: currentProduct.model,
            main_photo: currentProduct.main_photo,
          });
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };

    loadProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      main_photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });

    try {
      await updateProduct(productId, updatedFormData); // Call the update API
      navigate('/seller/products'); // Redirect to the product list
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      console.log('Product deleted successfully');
      // Optionally, you may want to redirect or update the UI after deletion
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Count:
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
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
