console.log('YouTube Comment Agent content script loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoInfo') {
    const videoId = new URLSearchParams(window.location.search).get('v');
    const title = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim();
    
    sendResponse({
      videoId,
      title,
      url: window.location.href,
      success: true
    });
  }
  return true;
});

// Observe YouTube page changes
const observer = new MutationObserver(() => {
  // Handle YouTube page navigation/changes
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
