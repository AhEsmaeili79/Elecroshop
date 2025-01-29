import axios from "axios";

const WISHLIST_API_URL = import.meta.env.VITE_API_URL + "/wishlist/";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
};

export const addToWishlist = async (productId) => {
    try {
        const headers = getAuthHeader();
        if (!headers) return false;
        const response = await axios.post(
            `${WISHLIST_API_URL}${productId}/add_to_wishlist/`,
            {},
            { headers }
        );
        return response.data;
    } catch {
        return false;
    }
};

export const fetchWishlist = async () => {
    try {
        const headers = getAuthHeader();
        if (!headers) return [];
        const response = await axios.get(WISHLIST_API_URL, { headers });
        return response.data;
    } catch {
        return [];
    }
};

export const removeFromWishlist = async (productId) => {
    try {
        const headers = getAuthHeader();
        if (!headers) return false;
        const response = await axios.delete(
            `${WISHLIST_API_URL}${productId}/remove_from_wishlist/`,
            { headers }
        );
        return response.data;
    } catch {
        return false;
    }
};
