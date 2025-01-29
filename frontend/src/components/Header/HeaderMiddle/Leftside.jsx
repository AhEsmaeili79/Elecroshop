import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/logo.png';

const navItems = [
  {
    label: 'خانه',
    link: '/',
    subMenu: [
      {
        title: 'دمو خود را انتخاب کنید',
        actionLink: '#',
        actionLabel: 'مشاهده همه دموها',
        imageUrl: null,
      },
    ],
  },
  {
    label: 'فروشگاه',
    link: 'category.html',
    subMenu: [
      {
        title: 'دسته‌بندی محصولات',
        links: [
          { label: 'دسته‌بندی محصول باکس شده', url: 'product-category-boxed.html' },
          { label: 'دسته‌بندی محصول تمام عرض', url: 'product-category-fullwidth.html', isNew: true },
        ],
      },
      {
        title: 'صفحات فروشگاه',
        links: [
          { label: 'سبد خرید', url: 'cart.html' },
          { label: 'پرداخت', url: 'checkout.html' },
          { label: 'لیست علاقه‌مندی‌ها', url: 'wishlist.html' },
          { label: 'حساب کاربری من', url: 'dashboard.html' },
          { label: 'کتابچه طراحی', url: '#' },
        ],
      },
      {
        imageUrl: 'assets/images/menu/banner-1.jpg',
        bannerText: 'فروش ویژه آخرین فرصت',
      },
    ],
  },
  {
    label: 'محصولات',
    link: 'product.html',
    subMenu: [
      {
        title: 'جزئیات محصول',
        imageUrl: 'assets/images/menu/banner-2.jpg',
        bannerText: 'مدهای جدید بهار ۲۰۱۹',
      },
    ],
  },
  {
    label: 'صفحات',
    subMenu: [
      {
        title: 'درباره ما',
        links: [
          { label: 'درباره ما ۰۱', url: 'about.html' },
          { label: 'درباره ما ۰۲', url: 'about-2.html' },
        ],
      },
      {
        title: 'تماس با ما',
        links: [
          { label: 'تماس ۰۱', url: 'contact.html' },
          { label: 'تماس ۰۲', url: 'contact-2.html' },
        ],
      },
      { label: 'ورود', url: 'login.html' },
      { label: 'سوالات متداول', url: 'faq.html' },
      { label: 'خطای ۴۰۴', url: '404.html' },
      { label: 'به زودی', url: 'coming-soon.html' },
    ],
  },
  {
    label: 'بلاگ',
    subMenu: [
      { label: 'کلاسیک', url: 'blog.html' },
      { label: 'لیستینگ', url: 'blog-listing.html' },
      { label: 'شبکه', url: '#' },
      { label: 'موزائیک', url: '#' },
      { label: 'ماسک', url: '#' },
      { label: 'پست تکی', url: '#' },
    ],
  },
  {
    label: 'المان‌ها',
    link: 'elements-list.html',
  },
];

const LeftSide = () => (
  <div className="header-left">
    <button className="mobile-menu-toggler">
      <span className="sr-only">تغییر منوی موبایل</span>
      <i className="icon-bars"></i>
    </button>
    <Link to='/' className="logo" >
      <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
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
              {link.isNew && <span className="tip tip-new">جدید</span>}
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
          <img src={menu.imageUrl} alt="بنر" />
          <div className={`banner-content ${menu.bannerText ? 'banner-content-top' : 'banner-content-bottom'}`}>
            <div className="banner-title text-white">{menu.bannerText}</div>
          </div>
        </a>
      </div>
    )}
  </>
);

export default LeftSide;
