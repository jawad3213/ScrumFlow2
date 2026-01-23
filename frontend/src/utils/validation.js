/**
 * Utility functions for form validation.
 */

/**
 * Validates an email address.
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates password strength (min 8 chars, 1 letter, 1 number).
 */
export const isValidPassword = (password) => {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
};

/**
 * Checks if a string is empty or only whitespace.
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};
