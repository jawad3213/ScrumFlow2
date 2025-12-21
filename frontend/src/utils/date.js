/**
 * Utility functions for date formatting and manipulation.
 */

/**
 * Formats a date string or object into a human-readable format.
 * Example: "2024-01-20" -> "Jan 20, 2024"
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

/**
 * Returns a relative time string (e.g., "2 days ago").
 */
export const getRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 84000)}d ago`;
};
