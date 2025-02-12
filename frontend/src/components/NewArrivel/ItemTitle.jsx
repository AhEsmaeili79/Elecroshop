import { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/Category'; 
import TabItem from './TabItem';
import './css/Tabitem.css'
import Spinner from '../Loading/loading';

const ItemTitle = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (id) => {
    onCategoryChange(id); 
  };

  if (loading) {
    <Spinner/>
  }

  return (
    <div className="heading heading-flex mb-3">
      <div className="heading-left">
        <h2 className="title"> جدیدترین ها</h2>
      </div>
      <div className="heading-right">
        <ul className="nav nav-pills nav-border-anim justify-content-center" role="tablist">
          <TabItem
            key="all"
            id="all"
            label="همه"
            isActive={selectedCategory === null}
            onClick={() => handleCategoryChange(null)}
          />
          {categories.map((category) => (
            <TabItem
              key={category.id}
              id={`new-${category.id}`}
              label={category.name}
              isActive={category.id === selectedCategory}
              onClick={() => handleCategoryChange(category.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemTitle;
