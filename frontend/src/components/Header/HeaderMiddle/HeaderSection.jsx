import { useEffect, useState }  from 'react';
import Modal from '../../../pages/AuthPage/Modal';
import HeaderTop from '../HeaderTop';

import { fetchUserData } from '../../../api/user';
import { logoutUser } from '../../../api/auth';
import HeaderMid from './HeaderMid';


const HeaderSection = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(localStorage.getItem('refresh_token'), localStorage.getItem('token'));
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      window.location.href = '/'; 
    }
  };

  return (
    <>
        <header className="header header-intro-clearance header-4">
            <HeaderTop toggleModal={toggleModal} handleLogout={handleLogout} isLoggedIn={isLoggedIn} username={user} />
            <HeaderMid/>
        </header>
        <Modal showModal={showModal} closeModal={toggleModal} />
    </>
  );
};

export default HeaderSection;
