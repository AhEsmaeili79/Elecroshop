import { Link } from 'react-router-dom';

const toPersianNumbers = (num) => {
  return num.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const HeaderTop = ({ toggleModal, isLoggedIn, handleLogout ,username }) => {
  return (
    <>
    <div className="header-top">
      <div className="container">
        <div className="header-left">
          <a href="tel:#">
            <i className="icon-phone"></i>تماس : {toPersianNumbers('0919123456')}
          </a>
        </div>
        <div className="header-right">
        
          <ul className="top-menu">
            <li>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard">خوش آمدید {username.username}</Link>
                </>
              ) : (
                <a onClick={toggleModal} style={{cursor:'pointer'}}>ورود</a>
              )}
              <ul>
              {isLoggedIn ? (
                    <>
                      <li><Link to="/wishlist"><i className="fa fa-heart"></i>لیست علاقه‌مندی‌ها</Link></li>
                      <li><Link to="/dashboard"><i className="fa fa-user"></i>اطلاعات شخصی</Link></li>
                      
                    </>
                  ) : null }
                <li><Link to="/about-us">درباره ما</Link></li>
                <li><Link to="/contact-us">تماس با ما</Link></li>
                {isLoggedIn ? (
                  <li><Link onClick={handleLogout}><i className='fa fa-sign-out'></i> خروج</Link></li>
                ) : <li><a  onClick={toggleModal} style={{cursor:'pointer'}}><i className="fa fa-user"></i>ورود</a> </li>}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeaderTop;
