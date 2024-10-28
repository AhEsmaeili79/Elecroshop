// src/components/Category/BrandList.jsx
import React, { useEffect, useState } from 'react';
import { fetchBrands, addBrand, deleteBrand } from './api';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      setBrands(data);
    };
    getBrands();
  }, []);

  const handleAddBrand = async () => {
    if (!newBrand) return;
    try {
      const addedBrand = await addBrand({ name: newBrand });
      setBrands([...brands, addedBrand]);
      setNewBrand('');
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      await deleteBrand(brandId);
      setBrands(brands.filter((brand) => brand.id !== brandId));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  return (
    <div>
      <h2>Brands</h2>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id}>
            {brand.name}
            <button onClick={() => handleDeleteBrand(brand.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newBrand}
        onChange={(e) => setNewBrand(e.target.value)}
        placeholder="New brand name"
      />
      <button onClick={handleAddBrand}>Add Brand</button>
    </div>
  );
};

export default BrandList;
