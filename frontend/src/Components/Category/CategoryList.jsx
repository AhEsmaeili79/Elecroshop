// src/components/Category/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, deleteCategory } from './api';
import './css/CategoryList.css'; // Importing CSS for styling

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError('Error fetching categories.');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory) return;

    try {
      const addedCategory = await addCategory({ name: newCategory });
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setNewCategory('');
    } catch (error) {
      setError('Error adding category.');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      setError('Error deleting category.');
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="category-list">
      <h2>Categories</h2>
      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <span className='Category-detail'>
              <strong>Category:</strong> {category.name} | <strong>Owner:</strong> {category.owner}
            </span>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="add-category">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          onFocus={() => setError(null)} // Clear error on focus
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
    </div>
  );
};

export default CategoryList;
