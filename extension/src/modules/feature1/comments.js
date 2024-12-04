import { YouTubeUtils } from '../utils/youtube-utils.js';
import { Logger } from '../utils/logger.js';

class CommentsManager {
    constructor() {
        this.logger = new Logger('CommentsManager');
        this.channelNameElement = document.querySelector('.channel-name');
        this.subscriberCountElement = document.querySelector('.subscriber-count');
        this.totalCommentsElement = document.querySelector('.total-comments');
        this.loadingStatusElement = document.querySelector('.loading-status');
        this.commentsListElement = document.querySelector('.comments-list');
        this.errorElement = document.querySelector('.error-message');
    }

    async initialize(videoId) {
        try {
            this.showLoading(true);
            this.clearError();
            
            // Fetch channel info
            const channelInfo = await YouTubeUtils.getChannelInfo(videoId);
            this.updateChannelInfo(channelInfo);
            
            // Update loading status
            this.loadingStatusElement.textContent = 'Loading channel info...';
            
            // TODO: Fetch comments here
            this.totalCommentsElement.textContent = '0 comments';
            
            this.showLoading(false);
        } catch (error) {
            this.logger.error('Error initializing comments:', error);
            this.showError('Failed to load video information');
            this.showLoading(false);
        }
    }

    updateChannelInfo(channelInfo) {
        if (this.channelNameElement) {
            this.channelNameElement.textContent = channelInfo.channelName;
        }
        if (this.subscriberCountElement) {
            this.subscriberCountElement.textContent = channelInfo.subscriberCount;
        }
    }

    showLoading(show) {
        const loader = document.querySelector('.comments-loader');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        if (this.errorElement) {
            const errorText = this.errorElement.querySelector('.error-text');
            if (errorText) {
                errorText.textContent = message;
            }
            this.errorElement.style.display = 'block';
        }
    }

    clearError() {
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }
}

export default CommentsManager;
