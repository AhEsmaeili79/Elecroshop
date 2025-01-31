import errorBg from "../../assets/images/error-bg.jpg"; 

const Body = () => {
  return (
    <>
      <div className="page-content" dir="rtl">
        <main className="main">
          <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
            <div className="container">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">خانه</a>
                </li>
                <li
                  className="breadcrumb-item active"
                  aria-current="page">
                  ۴۰۴
                </li>
              </ol>
            </div>
          </nav>
          <div
            className="error-content text-center"
            style={{
                backgroundImage: `url(${errorBg})`, 
            }}
          >
            <div className="container">
              <h1 className="error-title">خطای ۴۰۴</h1>
              <p>متأسفیم، صفحه‌ای که درخواست کرده‌اید موجود نیست.</p>
              <a
                href="/"
                className="btn btn-outline-primary-2 btn-minwidth-lg"
              >
                <span>بازگشت به صفحه اصلی</span>
                <i className="icon-long-arrow-right"></i>
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Body;
