import { useEffect, useState } from 'react';
import { fetchSellerProducts} from '../../../../api/seller/Products';
import ProductCard from './ProductCard';
import Spinner from 'react-bootstrap/Spinner';
import style from './css/SellerProductList.module.css';  
import AdminLayout from '../../dashboard/AdminLayout';

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchSellerProducts();
        setProducts(data);
      } catch (err) {
        console.error('مشکل در بارگذاری محصولات:', err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className={`text-center ${style.sellerProductList__loadingContainer}`}>
        <Spinner animation="border" variant="primary" />
        <p>در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className={`container ${style.sellerProductList__container}`}>
        <h1 className={`text-center my-5 ${style.sellerProductList__pageTitle}`}>محصولات شما</h1>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default SellerProductList;
