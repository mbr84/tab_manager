const fragment = document.createDocumentFragment();

chrome.storage.local.get('closedTabs', function(result) {

  for (var item in result.closedTabs) {
    if (result.closedTabs.hasOwnProperty(item)) {
      let el = document.createElement('li');
      let a = document.createElement('a');
      a.href = result.closedTabs[item].url;
      a.text = result.closedTabs[item].title;

      el.appendChild(a);
      fragment.appendChild(el);
    }
  }
  document.getElementById('links-list').appendChild(fragment);
});
