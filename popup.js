function getCurrentTabUrl(callback) {
  chrome.tabs.query({active: true, currentWindow: true},
    function(tabs) {
      const tab = tabs[0];
      callback(tab);
    }
  );
}

const timerLengths = { "timer-1": 1800000, "timer-2":3600000, "timer-3":86400000 }

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(tab) {
    const path = tab.url
    document.getElementById('current-site')
    .textContent = `Protect site "${path}"?`;

    const protectPageButton = document.getElementById('protect-page');
    protectPageButton.addEventListener('click', function() {
      chrome.storage.local.get("protectedPages", function(result) {
        const a = document.createElement('a')
        a.href = tab.url
        result.protectedPages[a.hostname] = true
        chrome.storage.local.set({ protectedPages: result.protectedPages })
      });
    });

  })
  const timers = Array.from(document.getElementsByClassName('timer-length'));
  timers.forEach((timer) => {
    timer.addEventListener('click', function() {
      chrome.storage.local.set({ timerLength: timerLengths[timer.id] })
    })
  })
});
