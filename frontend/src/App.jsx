// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import UserProfile from './Components/UserProfile/UserProfile'; // Importing UserProfile
import Navbar from './Components/Navbar'; // Assuming you have a Navbar for navigation
import Logout from './Components/Logout';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Route for UserProfile */}
        <Route path="/logout" element={<Logout />} /> {/* Route for UpdateUser */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}


export default App;
