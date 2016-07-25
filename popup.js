function getCurrentTabUrl(callback) {
  chrome.tabs.query({active: true, currentWindow: true},
    function(tabs) {
      const tab = tabs[0];
      callback(tab);
    }
  );
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(tab) {
    const path = tab.url
    document.getElementById('current-site')
    .textContent = `Protect site "${path}"?`;

    const protectPageButton = document.getElementById('protect-page');
    protectPageButton.addEventListener('click', function() {
      chrome.storage.local.get("protectedPages", function(result) {
        result.protectedPages[tab.url] = true
        chrome.storage.local.set({ protectedPages: result.protectedPages })
      });
    });
  })
});
