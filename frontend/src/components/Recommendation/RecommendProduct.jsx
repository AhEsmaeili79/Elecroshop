import ProductCard from "../ProductCard/ProductCard";

// تصاویر محصولات
import product1 from "../../assets/images/demos/demo-4/products/product-6.jpg";
import product2 from "../../assets/images/demos/demo-4/products/product-7.jpg";
import product3 from "../../assets/images/demos/demo-4/products/product-8.jpg";
import product4 from "../../assets/images/demos/demo-4/products/product-9.jpg";
import product5 from "../../assets/images/demos/demo-4/products/product-5.jpg";

const RecommendProduct = () => {

  // محصولات دسته‌بندی
  const products = [
    { img: product5, label: 'برترین', category: 'تلویزیون و سینمای خانگی', title: 'سامسونگ - تلویزیون LED 55 اینچ اسمارت 2160p', price: '۸۹۹.۹۹$', rating: 60, reviews: 5 },
    { img: product1, label: 'برترین', category: 'لپ‌تاپ‌ها', title: 'مک‌بوک پرو ۱۳" صفحه نمایش، i5', price: '۱۱۹۹.۹۹$', rating: 100, reviews: 4 },
    { img: product3, label: 'جدید', category: 'تبلت‌ها', title: 'اپل - آیپد پرو ۱۱ اینچ ۲۵۶ گیگابایت', price: '۸۹۹.۹۹$', rating: 80, reviews: 4 },
    { img: product2, label: '', category: 'صدا', title: 'بوز - بلندگوی بلوتوثی SoundLink', price: '۷۹.۹۹$', rating: 60, reviews: 6 },
    { img: product4, label: 'فروش ویژه', category: 'گوشی موبایل', title: 'گوگل - پیکسل ۳ ایکس ال ۱۲۸ گیگابایت', price: '۳۵.۴۱$', oldPrice: '۴۱.۶۷$', rating: 100, reviews: 10 },
    { img: product5, label: 'برترین', category: 'تلویزیون و سینمای خانگی', title: 'سامسونگ - تلویزیون LED 55 اینچ اسمارت 2160p', price: '۸۹۹.۹۹$', rating: 60, reviews: 5 },
    { img: product4, label: 'فروش ویژه', category: 'گوشی موبایل', title: 'گوگل - پیکسل ۳ ایکس ال ۱۲۸ گیگابایت', price: '۳۵.۴۱$', oldPrice: '۴۱.۶۷$', rating: 100, reviews: 10 },
    { img: product5, label: 'برترین', category: 'تلویزیون و سینمای خانگی', title: 'سامسونگ - تلویزیون LED 55 اینچ اسمارت 2160p', price: '۸۹۹.۹۹$', rating: 60, reviews: 5 },
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
