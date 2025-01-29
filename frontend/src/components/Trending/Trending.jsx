import { useState } from "react";
import ItemTitle from "./TrendingTitle";
import ProductCarousel from "./TrendingProduct";

const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState("trending-top"); 

  const handleTabChange = (tabId) => {
    setActiveTab(tabId); 
  };

  return (
    <>
      <div className="bg-light pt-5 pb-6">
        <div className="container trending-products">
          <ItemTitle activeTab={activeTab} onTabChange={handleTabChange} />
          <ProductCarousel activeTab={activeTab} /> 
        </div>
      </div>
    </>
  );
};

export default TrendingProducts;
