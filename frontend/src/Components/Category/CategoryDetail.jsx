// src/components/Category/CategoryDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategoryDetail, updateCategory, deleteCategory } from './api';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const getCategory = async () => {
      const data = await fetchCategoryDetail(categoryId);
      setCategory(data);
      setCategoryName(data.name);
    };
    getCategory();
  }, [categoryId]);

  const handleUpdateCategory = async () => {
    try {
      const updatedCategory = await updateCategory(categoryId, { name: categoryName });
      setCategory(updatedCategory);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(categoryId);
      // Redirect or show a success message here
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (!category) return <p>Loading...</p>;

  return (
    <div>
      <h2>Category Detail</h2>
      {isEditing ? (
        <>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button onClick={handleUpdateCategory}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{category.name}</h3>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDeleteCategory}>Delete</button>
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
