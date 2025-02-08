const AuthTab = ({ isSignUp, onTabChange }) => {
  return (
    <ul className="nav nav-pills nav-fill nav-border-anim" role="tablist">
      <li className="nav-item">
        <a
          className={`nav-link ${!isSignUp ? 'active' : ''}`}  
          onClick={() => onTabChange(false)}  
          role="tab"
        >
          ورود
        </a>
      </li>

      <li className="nav-item">
        <a
          className={`nav-link ${isSignUp ? 'active' : ''}`} 
          onClick={() => onTabChange(true)}  
          role="tab"
        >
          ثبت نام
        </a>
      </li>
    </ul>
  );
};

export default AuthTab;
