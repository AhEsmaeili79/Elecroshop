import './css/coloroption.css';

const ColorOptions = ({ colors, selectedColor, handleColorChange }) => {
  const toggleColorSelection = (colorId) => {
    if (selectedColor === colorId) {
      // If the color is already selected, deselect it
      handleColorChange(null);
    } else {
      // If the color is not selected, select it
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
            e.preventDefault(); // Prevent default link behavior
            toggleColorSelection(color.id); // Toggle the color selection
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
