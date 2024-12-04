import CommentsManager from '../modules/feature1/comments.js';
import { YouTubeUtils } from '../modules/utils/youtube-utils.js';

class Panel {
    constructor() {
        this.commentsManager = new CommentsManager();
        this.initializeTabs();
        this.initializeComments();
    }

    initializeTabs() {
        const tabs = ['transcript', 'summary', 'ai-chat', 'upgrade'];
        
        tabs.forEach(tab => {
            const tabElement = document.querySelector(`[data-tab="${tab}"]`);
            if (tabElement) {
                tabElement.addEventListener('click', () => this.switchTab(tab));
            }
        });
    }

    async initializeComments() {
        // Listen for messages from the extension
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'VIDEO_URL_UPDATED') {
                const videoId = YouTubeUtils.getVideoId(message.url);
                if (videoId) {
                    this.commentsManager.initialize(videoId);
                }
            }
        });

        // Get current tab URL on panel open
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const currentTab = tabs[0];
            if (currentTab && currentTab.url) {
                const videoId = YouTubeUtils.getVideoId(currentTab.url);
                if (videoId) {
                    await this.commentsManager.initialize(videoId);
                }
            }
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.querySelector(`#${tabId}-content`).classList.add('active');
    }
}

// Initialize the panel
new Panel(); 