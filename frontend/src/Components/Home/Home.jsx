// src/components/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api/user';
import WelcomeMessage from './WelcomeMessage';
import UserProfileImage from './UserProfileImage';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error) {
      setError('Failed to fetch user data.');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <WelcomeMessage username={userData.username} role={userData.role} />
      <UserProfileImage profileImage={userData.profile_image} />
    </div>
  );
};

export default Home;
