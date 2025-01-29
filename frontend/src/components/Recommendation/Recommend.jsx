import RecommendProduct from "./RecommendProduct";
import { Link } from 'react-router-dom';
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
                    <Link to='product' className="title-link">
                      مشاهده تمامی پیشنهادات <i className="icon-long-arrow-right"></i>
                    </Link>
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
