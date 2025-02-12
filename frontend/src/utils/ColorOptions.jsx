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
        color.quantity > 0 && (
          <a
            key={color.color}  
            href="#"
            className={selectedColor === color.color ? "active" : ""}
            onClick={(e) => {
              e.preventDefault(); 
              toggleColorSelection(color.color); 
            }}
            style={{ background: color.color_hex }} 
          >
            <span className="sr-only">{`Color: ${color.color}`}</span>
          </a>
        )
      ))}
    </div>
  );
};

export default ColorOptions;
