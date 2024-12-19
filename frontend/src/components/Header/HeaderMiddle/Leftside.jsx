import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/logo.png';

const navItems = [
  {
    label: 'Home',
    link: '/',
    subMenu: [
      {
        title: 'Choose your demo',
        actionLink: '#',
        actionLabel: 'View All Demos',
        imageUrl: null,
      },
    ],
  },
  {
    label: 'Shop',
    link: 'category.html',
    subMenu: [
      {
        title: 'Product Category',
        links: [
          { label: 'Product Category Boxed', url: 'product-category-boxed.html' },
          { label: 'Product Category Fullwidth', url: 'product-category-fullwidth.html', isNew: true },
        ],
      },
      {
        title: 'Shop Pages',
        links: [
          { label: 'Cart', url: 'cart.html' },
          { label: 'Checkout', url: 'checkout.html' },
          { label: 'Wishlist', url: 'wishlist.html' },
          { label: 'My Account', url: 'dashboard.html' },
          { label: 'Lookbook', url: '#' },
        ],
      },
      {
        imageUrl: 'assets/images/menu/banner-1.jpg',
        bannerText: 'Last Chance Sale',
      },
    ],
  },
  {
    label: 'Product',
    link: 'product.html',
    subMenu: [
      {
        title: 'Product Details',
        imageUrl: 'assets/images/menu/banner-2.jpg',
        bannerText: 'New Trends Spring 2019',
      },
    ],
  },
  {
    label: 'Pages',
    subMenu: [
      {
        title: 'About',
        links: [
          { label: 'About 01', url: 'about.html' },
          { label: 'About 02', url: 'about-2.html' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: 'Contact 01', url: 'contact.html' },
          { label: 'Contact 02', url: 'contact-2.html' },
        ],
      },
      { label: 'Login', url: 'login.html' },
      { label: 'FAQs', url: 'faq.html' },
      { label: 'Error 404', url: '404.html' },
      { label: 'Coming Soon', url: 'coming-soon.html' },
    ],
  },
  {
    label: 'Blog',
    subMenu: [
      { label: 'Classic', url: 'blog.html' },
      { label: 'Listing', url: 'blog-listing.html' },
      { label: 'Grid', url: '#' },
      { label: 'Masonry', url: '#' },
      { label: 'Mask', url: '#' },
      { label: 'Single Post', url: '#' },
    ],
  },
  {
    label: 'Elements',
    link: 'elements-list.html',
  },
];

const LeftSide = () => (
  <div className="header-left">
    <button className="mobile-menu-toggler">
      <span className="sr-only">Toggle mobile menu</span>
      <i className="icon-bars"></i>
    </button>
    <Link to='/' className="logo" >
      <img src={Logo} alt="Molla Logo" width="105" height="25" />
    </Link>
    <nav className="main-nav">
      <ul className="menu sf-arrows">
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  </div>
);

const NavItem = ({ item }) => (
  <li className={item.subMenu ? 'sf-with-ul' : ''}>
    <a href={item.link || '#'}>{item.label}</a>
    {item.subMenu && (
      <div className={`megamenu ${item.subMenu.length > 1 ? 'megamenu-md' : 'megamenu-sm'}`}>
        <div className="row no-gutters">
          {item.subMenu.map((menu, idx) => (
            <div key={idx} className={`col-md-${menu.imageUrl ? '4' : '6'}`}>
              <MenuSection menu={menu} />
            </div>
          ))}
        </div>
      </div>
    )}
  </li>
);

const MenuSection = ({ menu }) => (
  <>
    {menu.title && <div className="menu-title">{menu.title}</div>}
    {menu.links && (
      <ul>
        {menu.links.map((link, i) => (
          <li key={i}>
            <a href={link.url}>
              {link.label}
              {link.isNew && <span className="tip tip-new">New</span>}
            </a>
          </li>
        ))}
      </ul>
    )}
    {menu.actionLink && (
      <div className="megamenu-action text-center">
        <a href={menu.actionLink} className="btn btn-outline-primary-2 view-all-demos">
          <span>{menu.actionLabel}</span>
          <i className="icon-long-arrow-right"></i>
        </a>
      </div>
    )}
    {menu.imageUrl && (
      <div className="banner banner-overlay">
        <a href="category.html" className="banner banner-menu">
          <img src={menu.imageUrl} alt="Banner" />
          <div className={`banner-content ${menu.bannerText ? 'banner-content-top' : 'banner-content-bottom'}`}>
            <div className="banner-title text-white">{menu.bannerText}</div>
          </div>
        </a>
      </div>
    )}
  </>
);

export default LeftSide;
