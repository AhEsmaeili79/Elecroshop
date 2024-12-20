// src/components/NewArrivals.js
import ItemTitle from "./TrendingTitle";
import ProductCarousel from "./TrendingProduct";

const TrendingProducts = () => {
  return (
    <>
        <div className="bg-light pt-5 pb-6">
            <div className="container trending-products">
                <ItemTitle/>
                <ProductCarousel/>
            </div>
        </div>
    </>
  );
};

export default TrendingProducts;
