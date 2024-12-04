/**
 * Simple data storage using Chrome storage API
 */
export class DataStorage {
  /**
   * Save data to storage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {Promise<boolean>} Success status
   */
  static async save(key, data) {
    try {
      await chrome.storage.sync.set({ [key]: data });
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  /**
   * Get data from storage
   * @param {string} key - Storage key
   * @returns {Promise<any>} Stored data
   */
  static async get(key) {
    try {
      const result = await chrome.storage.sync.get(key);
      return result[key];
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }
} 