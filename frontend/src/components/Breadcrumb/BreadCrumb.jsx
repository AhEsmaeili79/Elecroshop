import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../api/productdetail';

const BreadCrumb = ({ categoryName }) => {
  const { productId } = useParams(); 
  const location = useLocation(); 
  const [productName, setProductName] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId)
        .then(product => setProductName(product.name)) 
        .catch(error => console.error('Error fetching product details:', error));
    }
  }, [productId]);

  const pathSegments = location.pathname.split('/').filter(segment => segment !== "");

  const persianPaths = {
    '/cart/': 'سبد خرید',
    '/': 'خانه',
    '/product': 'محصولات',
    '/wishlist/': 'علاقه‌مندی‌ها',
    '/dashboard/': 'حساب من',
    '/checkout/': 'پرداخت',
    '/orders': 'سفارشات',
    '/orders/': 'سفارشات',
    '/payment': 'پرداخت',
    '/callback/': 'وضعیت',
    '/product/': 'محصولات',
    '/about-us/': 'درباره ما',
    '/contact-us/': 'تماس با ما',
    '/role-request/' : 'تغییر نقش'
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`; 
    return {
      name: segment.replace(/-/g, ' '), 
      url
    };
  });

  const lastSegment = pathSegments[pathSegments.length - 1];
  let lastBreadcrumb = persianPaths[`/${lastSegment}/`] || persianPaths[lastSegment] || categoryName || (productName ? productName : lastSegment);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">{persianPaths['/'] || 'خانه'}</Link>
          </li>

          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="breadcrumb-item">
              {index < breadcrumbs.length - 1 ? (
                <Link to={breadcrumb.url}>{persianPaths[breadcrumb.url] || breadcrumb.name}</Link>
              ) : (
                <span>
                  {lastBreadcrumb}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default BreadCrumb;
