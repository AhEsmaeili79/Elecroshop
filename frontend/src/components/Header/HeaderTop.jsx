import React from 'react';
import { Link } from 'react-router-dom';

const HeaderTop = ({ toggleModal, isLoggedIn, handleLogout ,username }) => {
  return (
    <div className="header-top">
      <div className="container">
        <div className="header-left">
          <a href="tel:#">
            <i className="icon-phone"></i>تماس: +0123 456 789
          </a>
        </div>
        <div className="header-right">
        
          <ul className="top-menu">
            <li>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard/myaccount">خوش آمدید {username.username}</Link>
                </>
              ) : (
                <a href="#">لینک‌ها</a>
              )}
              <ul>
                <li><a href="about.html">درباره ما</a></li>
                <li><a href="contact.html">تماس با ما</a></li>
                  {isLoggedIn ? (
                    <>
                      <li><Link to="/wishlist"><i className="fa fa-heart"></i>لیست علاقه‌مندی‌ها</Link></li>
                      <li><Link to="/dashboard/myaccount"><i className="fa fa-user"></i>اطلاعات شخصی</Link></li>
                      <li><Link onClick={handleLogout}><i className='fa fa-sign-out'></i>خروج</Link></li>
                    </>
                  ) : (
                    <li><a href="#signin-modal" onClick={toggleModal}><i className="fa fa-user"></i>ورود</a> </li>
                  )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
