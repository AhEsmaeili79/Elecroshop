import  { useState, useEffect } from 'react';
import { submitReview, updateReview } from '../../../../api/reviews';
import './css/review.css';

const ReviewForm = ({ productId, onSubmit, reviewToEdit, clearEdit }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.comment);
      setTitle(reviewToEdit.title);
    } else {
      resetForm();
    }
  }, [reviewToEdit]);

  const resetForm = () => {
    setRating(1);
    setComment('');
    setTitle('');
  };

  const handleStarClick = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      product: productId,
      rating,
      comment,
      title,
    };

    try {
      setLoading(true);
      if (reviewToEdit) {
        await updateReview(reviewToEdit.id, reviewData); // Update existing review
      } else {
        await submitReview(reviewData); // Create new review
      }
      resetForm();
      if (clearEdit) clearEdit(); // Trigger callback to cancel or reset form visibility
      if (onSubmit) onSubmit(); // Refresh reviews
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''}`}
          onClick={() => handleStarClick(i)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label htmlFor="review-title">Review Title</label>
        <input
          type="text"
          id="review-title"
          placeholder="Enter review title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="review-rating">Rating</label>
        <div id="review-rating" className="stars">
          {renderStars()}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="review-comment">Your Review</label>
        <textarea
          id="review-comment"
          placeholder="Write your review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-btn mb-2" disabled={loading}>
        {loading ? 'Submitting...' : reviewToEdit ? 'Update Review' : 'Submit Review'}
      </button>
      {reviewToEdit && (
        <button type="button" className="btn btn-info w-100" onClick={clearEdit}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ReviewForm;
