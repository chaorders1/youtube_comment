// Background script for YouTube Comment Agent

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_VIDEO_INFO') {
    handleVideoInfo(sender.tab?.id, sendResponse);
    return true;
  }
  
  if (request.type === 'SAVE_DATA') {
    handleDataStorage(request.data, sendResponse);
    return true;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Open side panel
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Set panel options
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: 'src/panel/panel.html'
    });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// Helper functions
async function handleVideoInfo(tabId, sendResponse) {
  if (!tabId) {
    sendResponse({ error: 'Invalid tab' });
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tabId, { action: 'getVideoInfo' });
    sendResponse(response);
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleDataStorage(data, sendResponse) {
  try {
    await chrome.storage.sync.set(data);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

