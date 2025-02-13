import { useEffect, useState } from 'react';
import { 
  fetchSellerProducts, 
  fetchCategories,
  fetchBrands,
  fetchModels, 
} from '../../../../api/seller/Products';
import {Link} from 'react-router-dom';
import ProductCard from './ProductCard';
import style from './css/SellerProductList.module.css';  
import AdminLayout from '../../dashboard/AdminLayout';
import Spinner from '../../../../components/Loading/loading';

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, brds, mods] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchModels(),
        ]);
        setCategories(cats);
        setBrands(brds);
        setModels(mods);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);  
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchSellerProducts();
        setTimeout(() => {
          setProducts(data);
          setLoading(false);
        }, 500); 
      } catch (err) {
        console.error('مشکل در بارگذاری محصولات:', err);
        setLoading(false); 
      }
    };
    getProducts();
  }, []);

  if (loading) {
    return (
      <Spinner/>
    );
  }

  return (
    <AdminLayout>
      <div className={`container ${style.sellerProductList__container}`}>
        <Link to="/admin/products/add">اضافه کردن</Link>
        <h1 className={`text-center my-5 ${style.sellerProductList__pageTitle}`}>محصولات شما</h1>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <ProductCard product={product} category={categories} brand={brands} model={models} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default SellerProductList;
