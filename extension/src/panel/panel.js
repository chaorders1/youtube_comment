import CommentsManager from '../modules/feature1/comments.js';
import { YouTubeUtils } from '../modules/utils/youtube-utils.js';

class Panel {
    constructor() {
        this.commentsManager = new CommentsManager();
        this.initializeTabs();
        this.initializeComments();
        this.initializeUpgradeButton();
    }

    initializeTabs() {
        const tabs = ['transcript', 'summary', 'ai-chat', 'upgrade'];
        
        tabs.forEach(tab => {
            const tabElement = document.querySelector(`[data-tab="${tab}"]`);
            if (tabElement) {
                tabElement.addEventListener('click', () => {
                    this.switchTab(tab);
                    if (tab === 'upgrade') {
                        this.trackUpgradeView();
                    }
                });
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

    trackUpgradeView() {
        // Optional: Add analytics tracking when user views upgrade tab
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_upgrade_tab');
            }
        } catch (error) {
            console.debug('Analytics not available');
        }
    }

    initializeUpgradeButton() {
        const upgradeButton = document.querySelector('.upgrade-button');
        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => {
                // Send message to background script to open URL
                chrome.runtime.sendMessage({ 
                    type: 'OPEN_UPGRADE_URL',
                    url: 'https://bit.ly/chaorders'
                });
                
                // Track upgrade click
                this.trackUpgradeClick();
            });
        }
    }

    trackUpgradeClick() {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_upgrade_button');
            }
        } catch (error) {
            console.debug('Analytics not available');
        }
    }
}

// Initialize the panel
new Panel(); 