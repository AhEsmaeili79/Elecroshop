import ProductCard from "../ProductCard/ProductCard";

// Product Images
import product1 from "../../assets/images/demos/demo-4/products/product-6.jpg";
import product2 from "../../assets/images/demos/demo-4/products/product-7.jpg";
import product3 from "../../assets/images/demos/demo-4/products/product-8.jpg";
import product4 from "../../assets/images/demos/demo-4/products/product-9.jpg";
import product5 from "../../assets/images/demos/demo-4/products/product-5.jpg";

const RecommendProduct = () => {

  // Category products
  const products = [
    { img: product5, label: 'Top', category: 'TV & Home Theater', title: 'Samsung - 55" Class LED 2160p Smart', price: '$899.99', rating: 60, reviews: 5 },
    { img: product1, label: 'Top', category: 'Laptops', title: 'MacBook Pro 13" Display, i5', price: '$1,199.99', rating: 100, reviews: 4 },
    { img: product3, label: 'New', category: 'Tablets', title: 'Apple - 11 Inch iPad Pro 256GB', price: '$899.99', rating: 80, reviews: 4 },
    { img: product2, label: '', category: 'Audio', title: 'Bose - SoundLink Bluetooth Speaker', price: '$79.99', rating: 60, reviews: 6 },
    { img: product4, label: 'Top Sale', category: 'Cell Phone', title: 'Google - Pixel 3 XL 128GB', price: '$35.41', oldPrice: '$41.67', rating: 100, reviews: 10 },
    { img: product5, label: 'Top', category: 'TV & Home Theater', title: 'Samsung - 55" Class LED 2160p Smart', price: '$899.99', rating: 60, reviews: 5 },
    { img: product4, label: 'Top Sale', category: 'Cell Phone', title: 'Google - Pixel 3 XL 128GB', price: '$35.41', oldPrice: '$41.67', rating: 100, reviews: 10 },
    { img: product5, label: 'Top', category: 'TV & Home Theater', title: 'Samsung - 55" Class LED 2160p Smart', price: '$899.99', rating: 60, reviews: 5 },
  ];


  return (
    <>
        <div className="products">
            <div className="row justify-content-center">
                {products.map((product, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3">
                        <ProductCard key={index} product={product} />
                    </div>
                ))}
            </div>
        </div>
    </>
  );
};

export default RecommendProduct;
