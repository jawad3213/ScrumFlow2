import client from './client';

export const login = (credentials) => {
  return client('/login', { body: credentials });
};

export const forgotPassword = (email) => {
  return client('/forgot-password', { body: { email } });
};

export const resetPassword = (data) => {
  return client('/reset-password', { body: data });
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user');
};
