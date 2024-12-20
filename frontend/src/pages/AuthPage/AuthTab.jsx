// src/auth/AuthTab.jsx
const AuthTab = ({ isSignUp, onTabChange }) => {
  return (
    <ul className="nav nav-pills nav-fill nav-border-anim" role="tablist">
      {/* Sign In Tab */}
      <li className="nav-item">
        <a
          className={`nav-link ${!isSignUp ? 'active' : ''}`}  // Add 'active' class to the currently selected tab
          onClick={() => onTabChange(false)}  // Switch to sign-in when clicked
          role="tab"
        >
          Login 
        </a>
      </li>

      {/* Sign Up Tab */}
      <li className="nav-item">
        <a
          className={`nav-link ${isSignUp ? 'active' : ''}`}  // Add 'active' class to the currently selected tab
          onClick={() => onTabChange(true)}  // Switch to sign-up when clicked
          role="tab"
        >
          Register
        </a>
      </li>
    </ul>
  );
};

export default AuthTab;
