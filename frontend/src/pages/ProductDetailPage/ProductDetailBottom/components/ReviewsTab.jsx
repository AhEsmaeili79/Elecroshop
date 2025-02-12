import { useEffect, useState } from 'react';
import { fetchReviews, deleteReview } from '../../../../api/reviews';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { fetchUserData } from '../../../../api/user';
import Spinner from '../../../../components/Loading/loading';
const ReviewsTab = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); 
  const [userHasReviewed, setUserHasReviewed] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
      setLoading(false);


      const userReview = data.find((review) => review.user_id === localStorage.getItem('user_id')); 
      if (userReview) {
        setReviewToEdit(userReview);
        setUserHasReviewed(true);
      }
    } catch (err) {
      console.error('خطا در بارگذاری نظرها:', err);
      setError('بارگذاری نظرها با شکست مواجه شد.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getUserData = async () => {
    try {
      await fetchUserData();
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch (err) {
      console.error('حذف نظر با شکست مواجه شد:', err);
    }
  };

  const handleEdit = (review) => {
    setReviewToEdit(review);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false); 
    setReviewToEdit(null); 
  };

  const handleReviewSubmit = async () => {
    setIsFormVisible(false); 
    setReviewToEdit(null); 
    await loadReviews(); 
  };

  return (
    <div className="reviews-tab">
      {loading && <Spinner/>}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <>
        {isLoggedIn && !userHasReviewed && !isFormVisible && (
            <button
              className="btn btn-primary btn-lg rounded-lg mt-1 ml-2 px-4 py-2 shadow-sm hover-shadow-lg"
              onClick={() => setIsFormVisible(true)}
            >
              نوشتن نظر
            </button>
          )}
          {(userHasReviewed || isFormVisible) && (
            <ReviewForm
              productId={productId}
              onSubmit={handleReviewSubmit}
              reviewToEdit={reviewToEdit}
              clearEdit={handleCancel} 
            />
          )}
          <ReviewList reviews={reviews} onDelete={handleDelete} onEdit={handleEdit} />
        </>
      )}
    </div>
  );
};

export default ReviewsTab;
