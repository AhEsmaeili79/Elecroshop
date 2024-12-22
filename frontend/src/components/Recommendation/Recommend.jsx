import RecommendProduct from "./RecommendProduct";

const Recommendation = () => {
    return (
      <>
      <div className="mb-5"></div>
        <div className="container for-you">
            <div className="heading heading-flex mb-3">
                <div className="heading-left">
                    <h2 className="title">پیشنهادات برای شما</h2>
                </div>

                <div className="heading-right">
                    <a href="#" className="title-link">مشاهده تمامی پیشنهادات <i className="icon-long-arrow-right"></i></a>
                </div>
            </div>
            <RecommendProduct/>
        </div> 
        <div className="mb-4"></div>
        <div className="container">
                <hr className="mb-0"/>
        </div>
      </>
  );
};

export default Recommendation;
