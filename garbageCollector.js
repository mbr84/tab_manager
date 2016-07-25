const tabs = {};
let protectedPages;


chrome.storage.onChanged.addListener(function(changes) {
  for (let area in changes) {
    if (area === "protectedPages") {
      Object.keys(area).forEach(key => protectedPages[key] = area[key])
    }
  }
});

chrome.storage.local.get("protectedPages", function(result) {
  protectedPages = Object.assign({}, result.protectedPages);
});



const closeTab = function(tab) {
  chrome.tabs.remove(tab.id);
  const closedTab = { title: tab.title, url: tab.url };
  chrome.storage.local.get("closedTabs", function(result) {
    result.closedTabs[tab.title] = closedTab
    chrome.storage.local.set({closedTabs: result.closedTabs })
  });
};

chrome.tabs.onRemoved.addListener(function(tab) {

  clearTimeout(tabs[tab]);
});


const realTab = function(tab) {
  return tab.url.slice(0, 6) !== "chrome" && tab.title !== "New Tab"
};

const clearTimer = function(id) {
  clearTimeout(tabs[id]);
};

chrome.tabs.onActivated.addListener(function(activeTab) {
  debugger
  chrome.tabs.query({windowId: this.windowId}, function(results) {
    results.forEach((tab) => {
      if (realTab(tab) &&
        !protectedPages[tab.url] &&
        tabs[tab.id]) {
        tabs[tab.id] = setTimeout(closeTab.bind(this, tab), 3600000);
      } else if (tab.active) {
        clearTimeout(tabs[tab.id]);
      }
    });
  });
});
