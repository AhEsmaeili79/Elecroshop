// src/components/Trending.jsx
import TabItem from "../NewArrivel/TabItem";

const ItemTitle = () => {
    const tabs = [
      { id: 'trending-top', label: 'برترین امتیازها', isActive: true },
      { id: 'trending-best', label: 'پرفروش ترین' },
      { id: 'trending-sale', label: 'تخفیف ها' },
    ];
  
    return (
      <div className="heading heading-flex mb-3">
        <div className="heading-left">
          <h2 className="title"> محبوب ترین ها</h2>
        </div>
        <div className="heading-right">
          <ul className="nav nav-pills nav-border-anim justify-content-center" role="tablist">
            {tabs.map((tab) => (
              <TabItem key={tab.id} id={tab.id} label={tab.label} isActive={tab.isActive || false} />
            ))}
          </ul>
        </div>
      </div>
    );
};

export default ItemTitle;
