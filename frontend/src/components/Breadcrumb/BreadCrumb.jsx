import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../api/productdetail';

const BreadCrumb = ({ categoryName }) => {
  const { productId } = useParams(); // Get the productId from URL
  const location = useLocation(); // Get current location (URL)
  const [productName, setProductName] = useState(null);

  // Fetch product details to get the product name
  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId)
        .then(product => setProductName(product.name)) // Assuming the product has a 'name' field
        .catch(error => console.error('Error fetching product details:', error));
    }
  }, [productId]);

  // Split the pathname into segments
  const pathSegments = location.pathname.split('/').filter(segment => segment !== "");

  // Translate paths and breadcrumb names to Persian
  const persianPaths = {
    '/cart/': 'سبد خرید',
    '/': 'خانه',
    '/product': 'محصولات',
    '/wishlist': 'علاقه‌مندی‌ها',
    '/dashboard/myaccount': 'حساب من',
    '/checkout': 'پرداخت',
    '/orders': 'سفارشات',
    '/orders/:orderCode': 'جزئیات سفارش',
  };

  // Generate breadcrumb links dynamically
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`; // Create the URL path for each segment
    return {
      name: segment.replace(/-/g, ' '), // Format the segment (replace hyphens with spaces)
      url
    };
  });

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">{persianPaths['/'] || 'Home'}</Link>
          </li>

          {/* Conditionally render product name or category name */}
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="breadcrumb-item">
              {index < breadcrumbs.length - 1 ? (
                <Link to={breadcrumb.url}>{persianPaths[breadcrumb.url] || breadcrumb.name}</Link>
              ) : (
                // If it's the last breadcrumb, use categoryName if available
                <span>
                  {categoryName || (productName ? productName : breadcrumb.name)}
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
