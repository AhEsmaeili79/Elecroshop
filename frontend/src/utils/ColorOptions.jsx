import './css/coloroption.css';

const ColorOptions = ({ colors, selectedColor, handleColorChange }) => {
  const toggleColorSelection = (colorId) => {
    if (selectedColor === colorId) {
      handleColorChange(null);
    } else {
      handleColorChange(colorId);
    }
  };

  return (
      <div className="product-nav product-nav-dots">
        {colors.map((color) => (
          <a
            key={color.id}
            href="#"
            className={selectedColor === color.id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault(); 
              toggleColorSelection(color.id); 
            }}
            style={{ background: color.color_hex }}
          >
            <span className="sr-only">{color.name || "Color name"}</span>
          </a>
        ))}
      </div>
  );
};

export default ColorOptions;
