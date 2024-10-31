import React, { useState } from 'react';
import { submitReview } from './api/reviewApi';
import './css/review.css'

const ReviewForm = ({ productId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      product: productId, // Make sure productId is set
      first_name: firstName,
      last_name: lastName,
      rating: rating,
      comment: comment,
    };

    try {
      await submitReview(reviewData);
      // Optionally reset form or notify user
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Handle the error, e.g., show a notification
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((rate) => (
          <option key={rate} value={rate}>{rate}</option>
        ))}
      </select>
      <textarea placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
