const AuthChoice = ({ isSignUp }) => {
  return (
    <div className="form-choice">
      <p className="text-center">
        {isSignUp ? 'ثبت نام' : 'ورود'} با 
      </p>
      <div className="row">
        <div className="col-sm-6">
          <a href="#" className="btn btn-login btn-g">
            <i className="icon-google"></i>
            {isSignUp ? 'ثبت نام با گوگل' : 'ورود با گوگل'}
          </a>
        </div>

        <div className="col-sm-6">
          <a href="#" className="btn btn-login btn-f">
            <i className="icon-facebook-f"></i>
            {isSignUp ? 'ثبت نام با فیس‌بوک' : 'ورود با فیس‌بوک'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
