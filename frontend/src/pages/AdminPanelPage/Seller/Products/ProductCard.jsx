import { Link } from 'react-router-dom';
import style from './css/SellerProductList.module.css';

const ProductCard = ({ product, category, brand, model }) => {
  const categoryName = category.find(cat => cat.id === product.category)?.name || 'نامشخص';
  const brandName = brand.find(br => br.id === product.brand)?.name || 'نامشخص';
  const modelName = model.find(md => md.id === product.model)?.name || 'نامشخص';

  return (
    <Link to={`/admin/products/edit/${product.id}`} className={style.sellerProductList__productLink}>
      <div 
        className={`${style.sellerProductList__productCard} shadow-lg p-3 mb-5 bg-white rounded`} 
        dir="rtl"
      >
        <img 
          src={product.main_photo} 
          alt={product.name} 
          className={`${style.sellerProductList__productImage} img-fluid`} 
        />
        
        <h5 className={`${style.sellerProductList__productName} mt-3`}>{product.name}</h5>
        <p className={`${style.sellerProductList__productPrice} text-muted`}>
          قیمت: {product.price} تومان
        </p>
        
        <p className={style.sellerProductList__productModel}>
          <strong>دسته بندی:</strong> {categoryName}
        </p>
        <p className={style.sellerProductList__productModel}>
          <strong>مدل:</strong> {modelName}
        </p>
        <p className={style.sellerProductList__productBrand}>
          <strong>برند:</strong> {brandName}
        </p>

        <p className={style.sellerProductList__productDesc}>
          <strong>توضیحات:</strong> 
          {product.desc.length > 25 ? product.desc.slice(0, 25) + '...' : product.desc}
        </p>
        
        <div className={style.sellerProductList__productColors}>
          {product.color_quantities.map((colorData) => {
            // Extract RGB values 
            let r = parseInt(colorData.color_hex.substring(1, 3), 16);
            let g = parseInt(colorData.color_hex.substring(3, 5), 16);
            let b = parseInt(colorData.color_hex.substring(5, 7), 16);

            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            let textColor = brightness < 150 ? '#000' : '#ccc';

            return (
              <div 
                key={colorData.color} 
                style={{ 
                  backgroundColor: colorData.color_hex, 
                  color: textColor, 
                  width: '35px', 
                  height: '35px', 
                  borderRadius: '50%', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginLeft: '10px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '1px solid #ccc'
                }}
              >
                {colorData.quantity}
              </div>
            );
          })}
        </div>

        <p className={`${style.sellerProductList__productCount} mt-3`}>
          <strong>مجموع مقدار:</strong> {product.color_quantities.reduce((total, item) => total + item.quantity, 0)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
