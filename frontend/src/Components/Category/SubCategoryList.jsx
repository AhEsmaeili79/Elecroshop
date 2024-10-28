// src/components/Category/SubCategoryList.jsx

import React, { useEffect, useState } from 'react';
import { fetchSubCategories, fetchCategories, addSubCategory } from './api';

const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const getSubCategories = async () => {
      const data = await fetchSubCategories();
      setSubCategories(data);
    };

    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    getSubCategories();
    getCategories();
  }, []);

  // Handle adding a new subcategory
  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    if (!newSubCategoryName || !selectedCategoryId) {
      alert('Please provide both a category and subcategory name.');
      return;
    }

    try {
      const newSubCategory = await addSubCategory({
        name: newSubCategoryName,
        category: selectedCategoryId,  // Pass the selected category ID
      });

      // Update the subcategories list with the newly added subcategory
      setSubCategories((prevSubCategories) => [...prevSubCategories, newSubCategory]);
      setNewSubCategoryName(''); // Clear the input
      setSelectedCategoryId(''); // Reset the category dropdown
    } catch (error) {
      console.error('Error adding subcategory:', error);
      alert('Failed to add subcategory. Please try again.');
    }
  };

  return (
    <div>
      <h2>SubCategories</h2>
      
      {/* Form to add a new subcategory */}
      <form onSubmit={handleAddSubCategory}>
        <input
          type="text"
          placeholder="Subcategory Name"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
        />

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        <button type="submit">Add Subcategory</button>
      </form>

      {/* Display list of subcategories */}
      <ul>
        {subCategories.map((subCategory) => (
          <li key={subCategory.id}>
            {console.log(subCategory)}
            {subCategory.name} (Category: {subCategory.category.name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubCategoryList;
