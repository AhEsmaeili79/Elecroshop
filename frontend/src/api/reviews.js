import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/reviews/'; 

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
});

export const fetchReviews = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}?product=${productId}`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error; 
    }
};

export const submitReview = async (reviewData) => {
    try {
        const response = await axios.post(API_URL, reviewData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Failed to submit review:', error);
        throw error; 
    }
};

export const deleteReview = async (reviewId) => {
    try {
        await axios.delete(`${API_URL}${reviewId}/`, getAuthHeaders());
    } catch (error) {
        console.error('Failed to delete review:', error);
        throw error; 
    }
};

export const updateReview = async (reviewId, reviewData) => {
    try {
      const response = await axios.put(`${API_URL}${reviewId}/`, reviewData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error;
    }
  };