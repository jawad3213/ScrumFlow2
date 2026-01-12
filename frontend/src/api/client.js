import axios from 'axios';
import { toast } from 'sonner';
import API_BASE_URL from '@/utils/api';
import StorageService from '@/utils/storage';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = StorageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
       const originalRequest = error.config;
       // Avoid infinite loops if login itself fails or we are already identifying a login attempt
       if (originalRequest.url && !originalRequest.url.includes('/login')) {
           StorageService.clearAuth();
           window.location.assign('/login');
       }
    }

    // Return a consistent error message format
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Global Error Toaster
    if (error.response?.status >= 500) {
        toast.error('Server Error', { description: message });
    } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network Error', { description: 'Please check your connection.' });
    }

    return Promise.reject(message);
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
