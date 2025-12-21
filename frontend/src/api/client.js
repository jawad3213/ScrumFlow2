import API_BASE_URL from '@/utils/api';

const client = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user');
      window.location.assign('/login');
      return;
    }

    const data = await response.json();
    
    if (response.ok) {
      return data;
    }
    
    throw new Error(data.message || 'Something went wrong');
  } catch (error) {
    return Promise.reject(error.message || error);
  }
};

export default client;
