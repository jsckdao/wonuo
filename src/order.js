/**
 * Created by yonixee on 15-11-3.
 */

// 查找商品数据
function getItemById(data, itemId) {
  for (var k in data) {
    if (data[k].itemId == itemId) {
      return data[k];
    }
  }
}

// 获取商铺数据
function getShopRemark(order, data) {
  var as = order.find('a.itemInfo-link.J_MakePoint');
  var regx = /item\.htm\?.*id=(\d+)/;
  var item = null;
  for (var i = as.length; i--;) {
    var m = regx.exec(as[i].href);
    if (m && (item = getItemById(data, m[1]))) {
      break;
    }
  }

  if (item && item.shop) {
    return item.shop;
  }
  else return null;
}

// 填充备注文本框
function setTextRemark(order, remark) {
  var textarea = order.find('textarea.memo-input');
  if (textarea.length > 0) {
    doFocus(textarea[0]);
    textarea.val(remark);
    doBlur(textarea[0]);
  }
}

chrome.storage.local.get('shops', function(items) {
  if (!items) {
    return;
  }

  var data = items.shops;

  // 如果数据不存在, 忽略
  if (!data) {
    return;
  }

  // 开始循环检查页面是否准备就绪
  var _handle = setInterval(function() {
    var orderDivs = $('div.order');

    if (orderDivs.length > 0) {

      // 自动填写暗号
      orderDivs.each(function (i, div) {
        div = $(div);
        var shop = getShopRemark(div, data);
        console.log('shop: ', shop);
        shop && setTextRemark(div, shop.remark);
      });

      document.body.scrollTop = document.body.scrollHeight;


      // 清除循环
      clearInterval(_handle);

      // 清除数据
      chrome.storage.local.clear();

      console.log('start submit ...', new Date());

      // 开始不停地尝试点击提交按钮
      setInterval(function() {
        doClick('J_Go');
      }, 60);
    }
  }, 20);

});
