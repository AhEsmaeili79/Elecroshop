import React from 'react';

const BrandFilter = ({ brands, selectedBrands, handleCheckboxChange, setSelectedBrands, setSelectedBrand }) => {
  return (
    <div className="widget widget-collapsible">
      <h3 className="widget-title">
        <a
          data-toggle="collapse"
          href="#brand"
          role="button"
          aria-expanded="false"
          aria-controls="brand"
        >
          برندها
        </a>
      </h3>
      <div className="collapse" id="brand">
        <div className="widget-body">
          <div className="filter-items category filter-items-count">
            {brands.map((brand) => (
              <div className="filter-item" key={brand.id}>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`brand-${brand.id}`}
                    onChange={handleCheckboxChange(setSelectedBrands)}
                    checked={selectedBrands.includes(`brand-${brand.id}`)}
                  />
                  <label className="custom-control-label" htmlFor={`brand-${brand.id}`}>
                    {brand.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandFilter;
