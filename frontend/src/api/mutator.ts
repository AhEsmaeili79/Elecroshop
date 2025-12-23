import Axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/auth/tokenStorage';

// Create axios instance
const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        processQueue(error, null);
        clearTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await Axios.post<{ access: string; refresh: string }>(
          `${API_BASE_URL}/api/auth/refresh/`,
          { refresh: refreshToken }
        );

        const { access, refresh } = response.data;
        setTokens({ access, refresh });

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        processQueue(null, access);
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        isRefreshing = false;
        
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;

// Error handling type
export type ErrorType<Error> = AxiosError<Error>;
