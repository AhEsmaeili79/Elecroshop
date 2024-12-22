import React from 'react';

const ColorFilter = ({ colors, selectedColors, handleColorChange, setSelectedColors, setSelectedColor }) => {
  return (
    <div className="widget widget-collapsible">
      <h3 className="widget-title">
        <a
          data-toggle="collapse"
          href="#widget-3"
          role="button"
          aria-expanded="false"
          aria-controls="widget-3"
        >
          رنگ‌ها
        </a>
      </h3>
      <div className="collapse" id="widget-3">
        <div className="widget-body">
          <div className="filter-colors">
            {colors.map((color) => (
              <a
                href="#"
                key={color.id}
                style={{ background: color.color_hex }}
                className={selectedColors.includes(color.id) ? 'selected' : ''}
                onClick={(e) => handleColorChange(e, color.id)}
              >
                <span className="sr-only">{color.name || 'نام رنگ'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorFilter;
