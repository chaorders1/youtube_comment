/**
 * Helper functions for common tasks
 */

/**
 * Format date to readable string
 * @param {Date|number} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
