import { useEffect, useState }  from 'react';
import Modal from '../../pages/AuthPage/Modal';
import HeaderTop from './HeaderTop';
import HeaderMiddle from './HeaderHomePage/HeaderMiddle';
import HeaderBottom from './HeaderBottom';
import { fetchUserData } from '../../api/user';
import { logoutUser, refreshToken } from '../../api/auth';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);


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
      if (error.response && error.response.status === 401 && !isRefreshing) {
        await handleTokenRefresh();
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      } else {
        handleLogout();
      }
    }
  };

  const handleTokenRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshToken(); 
      await getUserData();
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout(); 
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsRefreshing(false);
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
        <HeaderTop toggleModal={toggleModal} handleLogout={handleLogout} isLoggedIn={isLoggedIn} username={user}/>
        <HeaderMiddle username={user} isLoggedIn={isLoggedIn} handleLogout={handleLogout} toggleModal={toggleModal}/>
        <HeaderBottom />

      </header>
      <Modal showModal={showModal} closeModal={toggleModal} />
    </>
  );
};

export default Header;
