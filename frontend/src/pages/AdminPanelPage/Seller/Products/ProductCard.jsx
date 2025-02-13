import { Link } from 'react-router-dom';
import style from './css/SellerProductList.module.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/admin/products/edit/${product.id}`} className={style.sellerProductList__productLink}>
      <div className={`${style.sellerProductList__productCard} shadow-lg p-3 mb-5 bg-white rounded`}>
        <img src={product.main_photo} alt={product.name} className={`${style.sellerProductList__productImage} img-fluid`} />
        
        <h5 className={`${style.sellerProductList__productName} mt-3`}>{product.name}</h5>
        <p className={`${style.sellerProductList__productPrice} text-muted`}>قیمت: {product.price} تومان</p>
        <p className={style.sellerProductList__productDesc}>
        {product.desc.length > 25 ? product.desc.slice(0, 25) + '...' : product.desc}
        </p>

        <p className={style.sellerProductList__productModel}><strong>دسته بندی:</strong> {product.category}</p>
        <p className={style.sellerProductList__productModel}><strong>مدل:</strong> {product.model}</p>
        <p className={style.sellerProductList__productBrand}><strong>برند:</strong> {product.brand}</p>
        
        <div className={style.sellerProductList__productColors}>
          {product.colors.map((color) => {
            let r = parseInt(color.color_hex.substring(1, 3), 16);
            let g = parseInt(color.color_hex.substring(3, 5), 16);
            let b = parseInt(color.color_hex.substring(5, 7), 16);

            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let textColor = brightness < 128 ? '#fff' : '#000';

            return (
              <div 
                key={color.id} 
                style={{ 
                  backgroundColor: color.color_hex, 
                  color: textColor, 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  display: 'inline-block', 
                  marginRight: '10px', 
                  textAlign: 'center', 
                  lineHeight: '30px', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
              </div>
            );
          })}
        </div>

        <p className={`${style.sellerProductList__productCount} mt-3`}>
          <strong>مقدار:</strong> {product.quantity}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
