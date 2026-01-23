import client from '@/lib/axios';
import StorageService from '@/utils/storage';

export const login = (credentials) => {
  return client('/login', { body: credentials });
};

export const forgotPassword = (email) => {
  return client('/forgot-password', { body: { email } });
};

export const resetPassword = (data) => {
  return client('/reset-password', { body: data });
};

export const refreshToken = () => {
  return client('/refresh-token', { method: 'POST' });
};

export const getMe = () => {
  return client('/me');
};

export const logout = () => {
  return client('/logout', { method: 'POST' });
};
