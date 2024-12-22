import { useState } from "react";
import DescriptionTab from "./components/DescriptionTab";
import AdditionalInfoTab from "./Components/AdditionalInfoTab";
import ShippingTab from "./components/ShippingTab";
import ReviewsTab from "./components/ReviewsTab";

const ProductTabs = ({ productId }) => {
  const [activeTab, setActiveTab] = useState("description");

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab />;
      case "additionalInfo":
        return <AdditionalInfoTab />;
      case "shipping":
        return <ShippingTab />;
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
