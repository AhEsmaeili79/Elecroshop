// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/User_section/Login/Login';
import Signup from './Components/User_section/Signup/Signup';
import Home from './Components/Home/Home';
import UserProfile from './Components/User_section/UserProfile/UserProfile'; // Importing UserProfile
import Navbar from './Components/Home/Navbar'; // Assuming you have a Navbar for navigation
import Logout from './Components/User_section/Logout/Logout';
import { fetchUserData } from './Components/api/user';
import { useEffect, useState } from 'react';
import UserRoleRequest from './Components/RoleRequest/UserRoleRequest';
import AdminRoleRequests from './Components/RoleRequest/AdminRoleRequests';


function App() {
  const [user, setUser] = useState(null); // State to store user data

  // Fetch user data when the component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data); // Set the fetched user data
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Route for UserProfile */}
        <Route path="/logout" element={<Logout />} /> {/* Route for UpdateUser */}
        {user && user.role === 'customer' && (
          <Route path="/request-role" element={<UserRoleRequest user={user} />} />
        )}

        {/* Route for admin to manage role requests */}
        {user && user.role === 'admin' && (
          <Route path="/manage-requests" element={<AdminRoleRequests />} />
        )}
        
      </Routes>
    </Router>
  );
}


export default App;
