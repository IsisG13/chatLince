let botStatus = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleBot') {
    botStatus[request.phone] = request.status;
    chrome.storage.local.set({ botStatus });
  } else if (request.action === 'getBotStatus') {
    sendResponse({ status: botStatus[request.phone] });
  }
});
