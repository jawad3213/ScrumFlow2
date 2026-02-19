import axios from 'axios';
import { toast } from 'sonner';
import API_BASE_URL from '@/utils/api';
import StorageService from '@/utils/storage';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for reading/sending HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Don't refresh if the error is from login or refresh-token itself
      if (originalRequest.url.includes('/login') || originalRequest.url.includes('/refresh-token') || originalRequest.url.includes('/register') || originalRequest.url.includes('/auth/google')) {
        StorageService.clearAuth();
        // Only redirect if not already on a public page
        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.assign('/login');
        }
        
        const errorMessage = error.response?.data?.message || 'Unauthorized';
        const errorObj = new Error(errorMessage);
        errorObj.response = error.response;
        return Promise.reject(errorObj);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios({
          method: 'POST',
          url: `${API_BASE_URL}/refresh-token`,
          withCredentials: true
        });

        const { access_token } = response.data;
        accessToken = access_token; // Mettre à jour la variable locale
        
        // Notifier le AuthContext du changement de token
        window.dispatchEvent(new CustomEvent('auth-token-refreshed', { detail: access_token }));
        
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        
        processQueue(null, access_token);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Only clear auth if it's a 401 (Refresh token expired/invalid)
        if (refreshError.response?.status === 401) {
            console.log('[Axios] Refresh token invalid (401), clearing auth');
            StorageService.clearAuth();
            accessToken = null;
            if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
                window.location.assign('/login');
            }
        } else {
            console.warn('[Axios] Refresh failed due to network/server error. Keeping tokens.');
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return a consistent error message object
    const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || 'Something went wrong';
    
    // Global Error Toaster
    if (error.response?.status >= 500) {
        toast.error('Server Error', { description: errorMessage });
    } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network Error', { description: 'Please check your connection.' });
    }

    // Reject with a proper Error-like object
    const errorObj = new Error(errorMessage);
    errorObj.response = error.response;
    return Promise.reject(errorObj);
  }
);

/**
 * Wrapper function to maintain backward compatibility with the existing client signature.
 * @param {string} endpoint - The API endpoint (e.g., '/projects').
 * @param {object} config - Configuration object { body, ...customConfig }.
 */
const client = async (endpoint, { body, ...customConfig } = {}) => {
  const config = {
    ...customConfig,
    url: endpoint,
    method: customConfig.method || (body ? 'POST' : 'GET'),
    data: body,
  };

  if (body instanceof FormData) {
     // Let Axios/Browser handle Content-Type for FormData to strictly set the boundary
     if (!config.headers) config.headers = {};
     config.headers['Content-Type'] = undefined; 
  }

  return axiosInstance(config);
};

export default client;
