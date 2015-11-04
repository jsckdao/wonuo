/**
 * Created by yonixee on 15-11-3.
 */

var _start_time = null;
chrome.storage.onChanged.addListener(function(items) {
  if (items.shops) {
    if (items.shops.newValue) {
      _start_time = new Date().getTime();
      console.log('start submit: ', _start_time);
    }
    else if (_start_time) {
      var end = new Date().getTime();
      console.log('end submit: ', end);
      console.log('use time: ', end - _start_time);
      _start_time = null;
    }
  }
});