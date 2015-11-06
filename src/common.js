/**
 * Created by yonixee on 15/11/3.
 */

/**
 * 延迟操作
 */
function lazyOperate(time) {
  return {
    handle: null,
    run: function(cb) {
      this.clear()
      this.handle = setTimeout(cb, time);
    },
    clear: function() {
      if (this.handle) {
        clearTimeout(this.handle);
      }
    }
  }
}

/**
 * 模拟点击事件
 * @param fireOnThis
 */
function doClick(fireOnThis) {
  if (typeof fireOnThis == 'string') {
    fireOnThis = document.getElementById(fireOnThis);
  }
  var evObj = document.createEvent('MouseEvents');
  evObj.initMouseEvent( 'click', true, false, window, 1, 622, 545, 683, 520, false, false, true, false, 0, null );
  fireOnThis.dispatchEvent(evObj);
}

function doFocus(fireOnThis) {
  doEvent('focus', fireOnThis);
}

function doBlur(fireOnThis) {
  doEvent('blur', fireOnThis);
}

function doEvent(name, fireOnThis) {
  if (typeof fireOnThis == 'string') {
    fireOnThis = document.getElementById(fireOnThis);
  }
  var evObj = document.createEvent('HTMLEvents');
  evObj.initEvent(name, false, false);
  fireOnThis.dispatchEvent(evObj);
}

/**
 *
 */
function callData(name, data, callback) {
  if (typeof data == 'function') {
    callback = data;
    data = '';
  }
  var rid = null;
  if (callback) {
    rid = new Date().getTime() + '_' + Math.random();
    var _func = function (e) {
      if (e.id == rid) {
        callback(e.data);
        chrome.extension.onMessage.removeListener(_func);
      }
    };
    chrome.extension.onMessage.addListener(_func);
  }
  chrome.extension.sendMessage({ name: name, data: data, id: rid });
}

/**
 *
 * @param name
 * @param handle
 */
function setCallHandle(name, handle) {
  chrome.extension.onMessage.addListener(function(msg) {
    if (msg.name == name) {
      var result = handle(msg.data) || {};
      if (msg.id) {
        chrome.extension.sendMessage({ id: msg.id, data: result });
      }
    }
  });
}

