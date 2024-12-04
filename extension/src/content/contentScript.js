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

  if (request.action === 'getChannelInfo') {
    try {
      // Get channel info from YouTube's page data
      const ytInitialData = window.ytInitialData;
      let channelName = 'Unknown Channel';
      let subscriberCount = 'N/A';

      if (ytInitialData?.contents?.twoColumnWatchNextResults?.results?.results?.contents) {
        const contents = ytInitialData.contents.twoColumnWatchNextResults.results.results.contents;
        const videoSecondaryInfoRenderer = contents.find(
          content => content.videoSecondaryInfoRenderer
        )?.videoSecondaryInfoRenderer;

        if (videoSecondaryInfoRenderer) {
          // Get channel name
          channelName = videoSecondaryInfoRenderer.owner?.videoOwnerRenderer?.title?.runs?.[0]?.text || channelName;
          
          // Get subscriber count
          subscriberCount = videoSecondaryInfoRenderer.owner?.videoOwnerRenderer?.subscriberCountText?.simpleText || subscriberCount;
        }
      }

      sendResponse({
        channelName,
        subscriberCount,
        success: true
      });
    } catch (error) {
      console.error('Error getting channel info:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
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
