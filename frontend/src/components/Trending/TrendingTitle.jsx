import TabItem from "../NewArrivel/TabItem";

const ItemTitle = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "trending-top", label: "برترین امتیازها" },
    { id: "trending-best", label: "پرفروش ترین" },
    { id: "trending-sale", label: "تخفیف ها" },
  ];

  return (
    <div className="heading heading-flex mb-3">
      <div className="heading-left">
        <h2 className="title"></h2>
      </div>
      <div className="heading-right">
        <ul className="nav nav-pills nav-border-anim justify-content-center" role="tablist">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={tab.id === activeTab}
              onClick={() => onTabChange(tab.id)} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemTitle;
