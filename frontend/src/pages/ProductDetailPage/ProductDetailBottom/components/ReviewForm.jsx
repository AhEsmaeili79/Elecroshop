import { useState, useEffect } from 'react';
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
        await updateReview(reviewToEdit.id, reviewData); 
      } else {
        await submitReview(reviewData);
      }
      resetForm();
      if (clearEdit) clearEdit(); 
      if (onSubmit) onSubmit(); 
    } catch (error) {
      console.error('ارسال نظر با مشکل مواجه شد:', error);
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
    <form onSubmit={handleSubmit} className="review-form mt-2">
      <div className="form-group">
        <label htmlFor="review-title">عنوان نظر</label>
        <input
          type="text"
          id="review-title"
          placeholder="عنوان نظر خود را وارد کنید"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="review-rating">امتیاز</label>
        <div id="review-rating" className="stars">
          {renderStars()}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="review-comment">نظر شما</label>
        <textarea
          id="review-comment"
          placeholder="نظر خود را بنویسید"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-btn mb-2" disabled={loading}>
        {loading ? 'در حال ارسال...' : reviewToEdit ? 'بروزرسانی نظر' : 'ارسال نظر'}
      </button>
        <button type="button" className="btn btn-info w-100" onClick={clearEdit}>
          لغو
        </button>
    </form>
  );
};

export default ReviewForm;
