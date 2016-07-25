chrome.storage.local.get('closedTabs', function(result) {
  for (var item in result.closedTabs) {
    if (result.closedTabs.hasOwnProperty(item)) {
      $("#links-list").append(
        `<li><a href="${result.closedTabs[item].url}">${result.closedTabs[item].title}</a></li>`
      )
    }
  }
});
