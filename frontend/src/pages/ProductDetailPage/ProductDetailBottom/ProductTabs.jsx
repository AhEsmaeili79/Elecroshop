import { useEffect, useState } from "react";
import DescriptionTab from "./components/DescriptionTab";
import AdditionalInfoTab from "./components/AdditionalInfoTab";
import ShippingTab from "./components/ShippingTab";
import ReviewsTab from "./components/ReviewsTab";
import { fetchProductDetails} from "../../../api/productdetail.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductTabs = ({ productId }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState("description");
  
  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductDetails(productId);
        setProduct(data)
      } catch (err) {
        toast.error("خطا در بارگذاری جزئیات محصول. لطفا دوباره تلاش کنید.");
      }
    };
    loadProductDetails();
  }, [productId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab activeTab={activeTab} product={product}/>;
      case "additionalInfo":
        return <AdditionalInfoTab activeTab={activeTab} product={product}/>;
      case "shipping":
        return <ShippingTab activeTab={activeTab} />;
      case "reviews":
        return <ReviewsTab productId={productId} />;
      default:
        return null;
    }
  };

  return (
    <div className="product-details-tab">
      <ul className="nav nav-pills justify-content-center" role="tablist">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
            role="tab"
          >
            توضیحات
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "additionalInfo" ? "active" : ""}`}
            onClick={() => setActiveTab("additionalInfo")}
            role="tab"
          >
            اطلاعات اضافی
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "shipping" ? "active" : ""}`}
            onClick={() => setActiveTab("shipping")}
            role="tab"
          >
            حمل و نقل و بازگشت کالا
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
            role="tab"
          >
            نظرات
          </a>
        </li>
      </ul>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default ProductTabs;
