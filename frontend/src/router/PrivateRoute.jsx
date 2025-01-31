import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUserData } from '../api/adminDashboard';

const PrivateRoute = ({ element, roles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = await fetchUserData();
    if (user && roles.includes(user.role)) {
        setUserRole(user.role);
      } else {
        setUserRole(null); 
      }
      setLoading(false);
    };

    checkUserRole();
  }, [roles]);

  if (loading) return <div>Loading...</div>; 

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
