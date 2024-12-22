import { useEffect, useState } from 'react';
import { fetchReviews, deleteReview } from '../../../../api/reviews';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const ReviewsTab = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // وضعیت نمایش فرم را ردیابی می‌کند
  const [userHasReviewed, setUserHasReviewed] = useState(false); // بررسی می‌کند که آیا کاربر قبلاً نظری برای این محصول نوشته است یا نه

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
      setLoading(false);

      // بررسی می‌کند که آیا کاربر قبلاً نظری برای محصول نوشته است
      const userReview = data.find((review) => review.user_id === localStorage.getItem('user_id')); // فرض بر این است که `user_id` در localStorage ذخیره شده است
      if (userReview) {
        setReviewToEdit(userReview); // اگر کاربر نظری نوشته باشد، نظر را برای ویرایش تنظیم می‌کند
        setUserHasReviewed(true); // کاربر نظری نوشته است، بنابراین فرم به طور پیش‌فرض مخفی می‌شود
      }
    } catch (err) {
      console.error('خطا در بارگذاری نظرها:', err);
      setError('بارگذاری نظرها با شکست مواجه شد.');
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
      console.error('حذف نظر با شکست مواجه شد:', err);
    }
  };

  const handleEdit = (review) => {
    setReviewToEdit(review);
    setIsFormVisible(true); // فرم را هنگام ویرایش نمایش می‌دهد
  };

  const handleCancel = () => {
    setIsFormVisible(false); // فرم را در صورت لغو مخفی می‌کند
    setReviewToEdit(null); // اگر لغو زده شود، نظری که برای ویرایش انتخاب شده بود، پاک می‌شود
  };

  const handleReviewSubmit = async () => {
    setIsFormVisible(false); // فرم را پس از ارسال یا به‌روزرسانی نظر مخفی می‌کند
    setReviewToEdit(null); // نظری که برای ویرایش انتخاب شده بود را پاک می‌کند
    await loadReviews(); // پس از ارسال یا به‌روزرسانی نظر، نظرها را دوباره بارگذاری می‌کند
  };

  return (
    <div className="reviews-tab">
      {loading && <div>در حال بارگذاری نظرها...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <>
          <ReviewList reviews={reviews} onDelete={handleDelete} onEdit={handleEdit} />
          {!userHasReviewed && !isFormVisible && (
            <button
              className="btn btn-primary"
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
              clearEdit={handleCancel} // تابع لغو را برای بازنشانی وضعیت ویرایش ارسال می‌کند
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsTab;
