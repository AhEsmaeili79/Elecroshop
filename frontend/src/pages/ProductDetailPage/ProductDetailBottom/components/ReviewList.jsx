import { useEffect, useState } from 'react';
import { fetchUserData } from '../../../../api/user';

const ReviewList = ({ reviews, onDelete, onEdit }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await fetchUserData(); 
        setCurrentUserId(userData.id); 
      } catch (error) {
        console.error('خطا در بارگیری داده‌های کاربر:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const timeAgo = (createdAt) => {
    const now = new Date();
    const reviewDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - reviewDate) / 1000);

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return `${diffInYears} سال پیش`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} ماه پیش`;
    } else if (diffInDays > 0) {
      return `${diffInDays} روز پیش`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ساعت پیش`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} دقیقه پیش`;
    } else {
      return 'همین الان';
    }
  };

  return (
    <div className="tab-pane fade show active" id="product-review-tab" role="tabpanel" aria-labelledby="product-review-link">
      <div className="reviews">
        <h3>نظرها ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p>هنوز نظری وجود ندارد. اولین نفری باشید که نظر می‌نویسید!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <div className="row no-gutters">
                <div className="col-auto">
                  <h4>
                    <a href="#">{review.user_first_name} {review.user_last_name}</a>
                  </h4>
                  <div className="ratings-container">
                    <div className="ratings">
                      <div
                        className="ratings-val"
                        style={{ width: `${(review.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="review-date">{timeAgo(review.created_at)}</span>
                </div>

                <div className="col">
                  <h4>{review.title || 'بدون عنوان'}</h4>

                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                  <div className="review-action">
                    {currentUserId === review.user && (
                      <>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(review)}>ویرایش</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(review.id)}>حذف</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
