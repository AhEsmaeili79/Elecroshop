import React from 'react';
import { Link } from 'react-router-dom';

const HeaderTop = ({ toggleModal, isLoggedIn, handleLogout ,username }) => {
  return (
    <div className="header-top">
      <div className="container">
        <div className="header-left">
          <a href="tel:#">
            <i className="icon-phone"></i>Call: +0123 456 789
          </a>
        </div>
        <div className="header-right">
        
          <ul className="top-menu">
            <li>
            {isLoggedIn ? (
                    <>
                      <Link to="/dashboard/myaccount">welcome {username.username}</Link>
                    </>
                  ) : (
              <a href="#">Links</a>
            )}
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact Us</a></li>
                  {isLoggedIn ? (
                    <>
                      <li><Link to="/wishlist"><i className="fa fa-heart"></i>Wishlist</Link></li>
                      <li><Link to="/dashboard/myaccount"><i className="fa fa-user"></i>Personal Info</Link></li>
                      <li><Link onClick={handleLogout}><i className='fa fa-sign-out'></i> Logout</Link></li>
                     </>
                  ) : (
                    <li><a href="#signin-modal" onClick={toggleModal}><i className="fa fa-user"></i>Login</a> </li>
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
