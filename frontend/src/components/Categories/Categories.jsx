import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../api/Category';
import { FaSpinner } from 'react-icons/fa'; 

import './category.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delayed, setDelayed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError('خطا در بارگذاری دسته‌ها.');
        console.error('خطا در بارگذاری دسته‌ها:', error);
      } finally {
        setTimeout(() => setDelayed(true), 300);
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/product/?category=${categoryId}`);
  };

  const categoriesToDisplay = categories.slice(0, 6);

  return (
    <div className="container category-containter">
      <h2 className="title text-center mb-4">محبوب ترین دسته بندی ها</h2>
      {loading && (
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {!loading && delayed && (
        <div className="cat-blocks-container">
          <div className="row">
            {categoriesToDisplay.map((category) => (
              <div key={category.id} className="col-6 col-sm-4 col-lg-2">
                <a
                  onClick={() => handleCategoryClick(category.id)}
                  className="cat-block"
                >
                  <figure>
                    <span>
                      <img
                        src={category.image || 'default-image.png'}
                        alt={`دسته‌بندی: ${category.name}`}
                      />
                    </span>
                  </figure>
                  <h3 className="cat-block-title">{category.name}</h3>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
