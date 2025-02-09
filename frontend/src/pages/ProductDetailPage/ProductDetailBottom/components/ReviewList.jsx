import { useEffect, useState } from 'react';
import { fetchUserData } from '../../../../api/user';
import { FaEdit, FaTrash } from 'react-icons/fa'; // To use icons for buttons

const ReviewList = ({ reviews, onDelete, onEdit }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await fetchUserData();
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
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
      return `${toPersianNumerals(diffInYears)} سال پیش`;
    } else if (diffInMonths > 0) {
      return `${toPersianNumerals(diffInMonths)} ماه پیش`;
    } else if (diffInDays > 0) {
      return `${toPersianNumerals(diffInDays)} روز پیش`;
    } else if (diffInHours > 0) {
      return `${toPersianNumerals(diffInHours)} ساعت پیش`;
    } else if (diffInMinutes > 0) {
      return `${toPersianNumerals(diffInMinutes)} دقیقه پیش`;
    } else {
      return 'همین الان';
    }
  };

  const toPersianNumerals = (number) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
  };

  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="tab-pane fade show active" id="product-review-tab" role="tabpanel" aria-labelledby="product-review-link">
      <div className="reviews">
        <h3>نظرها ({toPersianNumerals(reviews.length)})</h3>
        {reviews.length === 0 ? (
          <p>هنوز نظری وجود ندارد. اولین نفری باشید که نظر می‌نویسید!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review mb-4 rounded-lg review-form mt-2" style={{ position: 'relative', border: '1px solid #ddd', padding: '15px' }}>
              <div className="row no-gutters align-items-center">
                {currentUserId === review.user && (
                  <div
                    className="btn-group"
                    role="group"
                    style={{
                      position: 'absolute',
                      top: '10px', 
                      left: '10px', 
                      zIndex: 1,
                    }}
                  >
                    <button
                      className="btn btn-outline-info"
                      onClick={() => onEdit(review)}
                      title="ویرایش نظر"
                      style={{ width: '40px', minWidth: '40px', marginLeft:'2px' }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(review.id)}
                      title="حذف نظر"
                      style={{ width: '40px', minWidth: '40px', marginLeft: '2px' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
                <div className="col-12 col-md-8 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 mr-3" >
                        {review.user_first_name} {review.user_last_name}
                      </h4>
                      <span className="review-date text-dark-gray">{timeAgo(review.created_at)}</span>
                    </div>
                  </div>

                  <h5 className="mt-3">{review.title || 'بدون عنوان'}</h5>

                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>

                  <div className="ratings-container mt-3">
                  </div>
                </div>

                <div className="col-12 col-md-4 d-flex justify-content-center mt-3 mt-md-0">
                  <div className="card p-3">
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 mr-2">امتیاز:</h6>
                      <div className="ratings">
                        <div
                          className="ratings-val"
                          style={{ width: `${(review.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{toPersianNumerals(review.rating)}/۵</span>
                    </div>
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
