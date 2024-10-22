import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            {user ? (
                <div>
                    <p>Hello, {user}!</p>
                    <button onClick={logout}>Logout</button>
                    <Link to="/profile">Profile</Link>
                </div>
            ) : (
                <div>
                    <p>You are not logged in.</p>
                    <Link to="/login">Login</Link>
                    <br />
                    <Link to="/signup">Signup</Link>
                </div>
            )}
        </div>
    );
};

export default Home;
