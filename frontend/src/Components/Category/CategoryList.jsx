// src/components/Category/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from './api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      const addedCategory = await addCategory({ name: newCategory });
      setCategories([...categories, addedCategory]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category name"
      />
      <button onClick={handleAddCategory}>Add Category</button>
    </div>
  );
};

export default CategoryList;
