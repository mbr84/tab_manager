chrome.storage.local.get('closedTabs', function(result) {
  for (var item in result.closedTabs) {
    if (result.closedTabs.hasOwnProperty(item)) {
      $("#links-list").append(
        `<li><a href="${result.closedTabs[item].url}">${result.closedTabs[item].title}</a></li>`
      )
    }
  }
});

chrome.storage.local.get('protectedPages', function(result) {
  for (var item in result.protectedPages) {
    if (result.protectedPages.hasOwnProperty(item)) {
      $("#protected-pages").append(
        `<li><a href="${item}">${item}</a></li>`
      )
    }
  }
});
