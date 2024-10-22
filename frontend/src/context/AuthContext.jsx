import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem("username") || null);
    const navigate = useNavigate(); // To handle redirection

    const login = async (username, password) => {
        const response = await axios.post("http://localhost:8000/api/auth/jwt/create/", {
            username, password
        });

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("username", username);  // Store the username locally
        setUser(username);
        
        navigate("/"); // Redirect to the Home page after login
    };

    const signup = async (username, email, password) => {
        await axios.post("http://localhost:8000/api/auth/users/", {
            username, email, password
        });
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        setUser(null);
        navigate("/login"); // Redirect to the login page after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
