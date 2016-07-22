let tabs = {};
const closedTabs = {};

chrome.tabs.onCreated.addListener(function(tab) {
  const now = new Date().getHours
  if (!tab.active) {
    tabs[tab.id] = now
  }
});

chrome.tabs.onActivated.addListener(function() {
  const now = new Date().getHours
  chrome.tabs.query({active: false}).forEach((tab) => {
    if (!tabs[tab.id]) {
      tabs[tab.id] = now
    } else {
      if (now - tabs[tab.id] >= 1) {
        closedTabs[tab.title] = tab.url
        chrome.storage.local.set({tabs: closedTabs })
        chrome.tabs.remove(tab.id)
      }
    }
  });
});
