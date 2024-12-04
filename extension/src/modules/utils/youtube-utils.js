/**
 * YouTube utilities for extracting video and channel information
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

  /**
   * Get channel information from video page
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<{channelName: string, subscriberCount: string}>} Channel info
   */
  static async getChannelInfo(videoId) {
    try {
      // Fetch the video page
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
      const html = await response.text();

      // Import node-html-parser
      const { parse } = await import('node-html-parser');
      const root = parse(html);

      // Extract channel name - multiple selectors for redundancy
      let channelName = root.querySelector('#owner #channel-name a')?.text?.trim() ||
                       root.querySelector('ytd-channel-name yt-formatted-string a')?.text?.trim() ||
                       root.querySelector('a.ytd-channel-name')?.text?.trim();

      // Extract subscriber count
      let subscriberCount = root.querySelector('#owner-sub-count')?.text?.trim() ||
                           root.querySelector('#subscriber-count')?.text?.trim();

      console.log('Extracted channel info:', { channelName, subscriberCount }); // Debug log

      return {
        channelName: channelName || 'Unknown Channel',
        subscriberCount: this.formatSubscriberCount(subscriberCount || 'N/A')
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return {
        channelName: 'Error loading channel',
        subscriberCount: 'N/A'
      };
    }
  }

  /**
   * Format subscriber count for display
   * @private
   */
  static formatSubscriberCount(count) {
    if (count === 'N/A') return count;
    
    // If it's already formatted (e.g. "1.2M subscribers")
    if (typeof count === 'string' && count.includes('subscriber')) {
      return count;
    }

    // Format raw number
    try {
      const num = parseInt(count, 10);
      if (isNaN(num)) return count;

      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M subscribers`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K subscribers`;
      }
      return `${num} subscribers`;
    } catch {
      return count;
    }
  }
} 