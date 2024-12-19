// src/components/Trending.jsx
import TabItem from "../../components/ItemTitle";

const ItemTitle = () => {
    const tabs = [
      { id: 'trending-top', label: 'Top Rated', isActive: true },
      { id: 'trending-best', label: 'Best Selling' },
      { id: 'trending-sale', label: 'On Sale' },
    ];
  
    return (
      <div className="heading heading-flex mb-3">
        <div className="heading-left">
          <h2 className="title">Trending Products</h2>
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
  