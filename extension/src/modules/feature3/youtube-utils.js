/**
 * YouTube utilities
 */
export class YouTubeUtils {
  /**
   * Extract video ID from YouTube URL
   * @param {string} url - YouTube video URL
   * @returns {string|null} Video ID or null if invalid
   */
  static getVideoId(url) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  }
} 