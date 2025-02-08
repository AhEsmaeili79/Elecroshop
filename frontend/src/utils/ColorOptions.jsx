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
    <div className="product-color-options">
      {colors.map((color) => (
        <a
          key={color.id}
          className={`product-color-option ${selectedColor === color.id ? "selected" : ""}`}
          onClick={(e) => {
            e.preventDefault(); 
            toggleColorSelection(color.id); 
          }}
          style={{ backgroundColor: color.color_hex }}
        >
          <span className="sr-only">{color.name || "Color Name"}</span>
        </a>
      ))}
    </div>
  );
};

export default ColorOptions;
