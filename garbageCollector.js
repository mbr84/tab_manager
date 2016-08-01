const tabs = {};
let protectedPages;
let timerLength;

const getProtectedPages = function() {
  chrome.storage.local.get("protectedPages", function(result) {
    protectedPages = Object.assign({}, result.protectedPages);
  });
};

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({closedTabs: {}, protectedPages: {}, timerLength: 3600000 })
});

const getTimerLength = function() {
  chrome.storage.local.get("timerLength", function(result) {
    timerLength = parseInt(result.timerLength);
  });
};

getTimerLength();

getProtectedPages();

chrome.storage.local.get()

chrome.storage.onChanged.addListener(function(changes) {
  if (changes["protectedPages"]) {
    getProtectedPages();
    chrome.tabs.query({windowId: this.windowId}, function(results) {
      for (let tab in result) {
        if (protectedPages.hasOwnProperty(tab.url)) {
          clearTimeout(tabs[tab.id])
        }
      }
    })
  } else if (changes["timerLength"]) {
    timerLength = parseInt(changes["timerLength"])
  }
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
  chrome.tabs.query({windowId: this.windowId}, function(results) {
    results.forEach((tab) => {
      let a = document.createElement('a');
      a.href = tab.url;
      if (tab.active) {
        clearTimeout(tabs[tab.id]);
        delete tabs[tab.id];
      } else if (realTab(tab) &&
        !protectedPages[a.hostname] &&
        !tabs[tab.id]) {
        tabs[tab.id] = setTimeout(closeTab.bind(this, tab), timerLength);
      }
    });
  });
});
