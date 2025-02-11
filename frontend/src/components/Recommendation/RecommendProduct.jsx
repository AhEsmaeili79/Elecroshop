import { useEffect, useState } from 'react';
import { fetchProductList } from '../../api/productdetail';
import ProductCard from "../ProductCard/ProductCard";

const RecommendProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchProductList(); 
        setProducts(data); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts(); 
  }, []); 


  const displayedProducts = products.slice(0, 8);

  return (
    <>
      <div className="products">
        <div className="row justify-content-center">
        {displayedProducts.map((product, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <ProductCard key={index} product={product} />
          </div>
          
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendProduct;
