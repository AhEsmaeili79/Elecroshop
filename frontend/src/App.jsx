import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

const App = () => {
    const token = localStorage.getItem('token'); // Check if the user is logged in

    return (
        <Router>
            <Routes>
                <Route 
                    path="/signup" 
                    element={token ? <Navigate to="/home" /> : <Signup />} 
                />
                <Route 
                    path="/login" 
                    element={token ? <Navigate to="/home" /> : <Login />} 
                />
                <Route 
                    path="/home" 
                    element={token ? <Home /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to={token ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
