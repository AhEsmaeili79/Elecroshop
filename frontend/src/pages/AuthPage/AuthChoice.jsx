// src/auth/AuthChoice.jsx

const AuthChoice = ({ isSignUp }) => {
  return (
    <div className="form-choice">
      <p className="text-center">
        or {isSignUp ? 'sign up' : 'sign in'} with
      </p>
      <div className="row">
        {/* Google Login */}
        <div className="col-sm-6">
          <a href="#" className="btn btn-login btn-g">
            <i className="icon-google"></i>
            {isSignUp ? 'Sign Up With Google' : 'Sign In With Google'}
          </a>
        </div>

        {/* Facebook Login */}
        <div className="col-sm-6">
          <a href="#" className="btn btn-login btn-f">
            <i className="icon-facebook-f"></i>
            {isSignUp ? 'Sign Up With Facebook' : 'Sign In With Facebook'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
