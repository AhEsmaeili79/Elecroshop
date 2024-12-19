import axios from "axios";

const WISHLIST_API_URL = 'http://127.0.0.1:8000/api/wishlist/';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("User is not authenticated");
    return { Authorization: `Bearer ${token}` };
  };

// Add a product to the wishlist
export const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${WISHLIST_API_URL}${productId}/add_to_wishlist/`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding product to wishlist:', error.response?.data);
      throw new Error(error.response?.data?.detail || "Failed to add product to wishlist");
    }
  };

// Fetch the current user's wishlist
export const fetchWishlist = async () => {
    try {
        const response = await axios.get(WISHLIST_API_URL, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error.response?.data);
        throw new Error("Failed to fetch wishlist");
    }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
    try {
        const response = await axios.delete(
            `${WISHLIST_API_URL}${productId}/remove_from_wishlist/`,
            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error removing product from wishlist:", error.response?.data);
        throw new Error(error.response?.data?.detail || "Failed to remove product from wishlist");
    }
};
