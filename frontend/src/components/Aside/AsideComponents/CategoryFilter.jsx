const CategoryFilter = ({ categories, selectedCategories, handleCheckboxChange, setSelectedCategories }) => {

  const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };
  
  return (
    <div className="widget widget-collapsible">
      <h3 className="widget-title">
        <a
          data-toggle="collapse"
          href="#category"
          role="button"
          aria-expanded="false"
          aria-controls="category"
        >
          دسته‌بندی‌ها
        </a>
      </h3>
      <div className="collapse" id="category">
        <div className="widget-body">
          <div className="filter-items category filter-items-count">
            {categories
              .filter((category) => category.productCount > 0)
              .map((category) => (
                <div className="filter-item" key={category.id}>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`category-${category.id}`}
                      onChange={handleCheckboxChange(setSelectedCategories)}
                      checked={selectedCategories.includes(`category-${category.id}`)}
                    />
                    <label className="custom-control-label" htmlFor={`category-${category.id}`}>
                      {category.name}
                    </label>
                  </div>
                  <span className="item-count">{toPersianNumbers(category.productCount) || toPersianNumbers('0')}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
