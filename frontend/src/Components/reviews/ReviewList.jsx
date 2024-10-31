// ReviewList.jsx
import React from 'react';

const ReviewList = ({ reviews }) => {
  if (!Array.isArray(reviews)) {
    reviews = []; // Set reviews to an empty array if it's not an array
  }
  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review, index) => (
            <div key={index} className="review-item">
                {review.user_first_name && review.user_last_name && (
                    <div className="review-user">
                        {review.user_first_name} {review.user_last_name} {review.is_buyer && <span>(Buyer)</span>}
                    </div>
                )}
                <div>Rating: <span  className="review-rating">{'⭐'.repeat(review.rating)}</span>{'☆'.repeat(5 - review.rating)}</div>
                <div className="review-comment">{review.comment}</div>
                <div className="review-date">{new Date(review.created_at).toLocaleDateString()}</div>
            </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;


