import { useEffect, useState } from 'react';
import { fetchReviews, deleteReview } from '../../../../api/reviews';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const ReviewsTab = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track whether the form is visible
  const [userHasReviewed, setUserHasReviewed] = useState(false); // Track if the user already has a review for this product

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
      setLoading(false);

      // Check if the user has already reviewed the product
      const userReview = data.find((review) => review.user_id === localStorage.getItem('user_id')); // Assuming `user_id` is stored in localStorage
      if (userReview) {
        setReviewToEdit(userReview); // Set review to edit if user has reviewed
        setUserHasReviewed(true); // User has reviewed, so we hide the form by default
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews.');
      setLoading(false);
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
      console.error('Failed to delete review:', err);
    }
  };

  const handleEdit = (review) => {
    setReviewToEdit(review);
    setIsFormVisible(true); // Show form when editing
  };

  const handleCancel = () => {
    setIsFormVisible(false); // Hide form on cancel
    setReviewToEdit(null); // Clear review to edit if cancel is clicked
  };

  const handleReviewSubmit = async () => {
    setIsFormVisible(false); // Hide form after submitting or updating review
    setReviewToEdit(null); // Clear review to edit
    await loadReviews(); // Reload reviews after submitting or updating
  };

  return (
    <div className="reviews-tab">
      {loading && <div>Loading reviews...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <>
          <ReviewList reviews={reviews} onDelete={handleDelete} onEdit={handleEdit} />
          {!userHasReviewed && !isFormVisible && (
            <button
              className="btn btn-primary"
              onClick={() => setIsFormVisible(true)}
            >
              Write a Review
            </button>
          )}
          {(userHasReviewed || isFormVisible) && (
            <ReviewForm
              productId={productId}
              onSubmit={handleReviewSubmit}
              reviewToEdit={reviewToEdit}
              clearEdit={handleCancel} // Pass cancel function to reset edit state
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsTab;
