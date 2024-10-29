// src/components/Category/SubCategoryList.jsx
import React, { useEffect, useState } from 'react';
import { fetchSubCategories, addSubCategory, deleteSubCategory, fetchCategories } from './api';
import './css/SubCategoryList.css'; 

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // State for selected category
  const [error, setError] = useState(null);

  // Fetch subcategories and categories
  const fetchData = async () => {
    try {
      const [subCatData, categoryData] = await Promise.all([fetchSubCategories(), fetchCategories()]);
      setSubCategories(subCatData);
      setCategories(categoryData); // Set categories
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add a new subcategory
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    try {
      const newSubCategory = await addSubCategory({ name: newSubCategoryName, category: selectedCategoryId });
      setSubCategories([...subCategories, newSubCategory]);
      setNewSubCategoryName('');
      setSelectedCategoryId(''); // Reset selected category
    } catch (err) {
      setError('Error adding subcategory: ' + err.message);
    }
  };

  // Delete a subcategory
  const handleDeleteSubCategory = async (id) => {
    try {
      await deleteSubCategory(id);
      setSubCategories(subCategories.filter((subCat) => subCat.id !== id));
    } catch (err) {
      setError('Error deleting subcategory: ' + err.message);
    }
  };

  return (
    <div className="subcategory-container">
      <h2>SubCategory List</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddSubCategory}>
        <input
          type="text"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
          placeholder="New SubCategory Name"
          required
        />
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit">Add SubCategory</button>
      </form>
      <ul>
        {subCategories.map((subCategory) => (
          <li key={subCategory.id}>
            {console.log(subCategory)}
            <span className='category-name'>
            <strong>Sub Category:</strong> {subCategory.name} | <strong> Category:</strong> {subCategory.category_name} | <strong>Owner:</strong> {subCategory.owner} 
            </span>
            <button onClick={() => handleDeleteSubCategory(subCategory.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default SubCategoryList;
