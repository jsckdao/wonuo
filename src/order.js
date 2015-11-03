/**
 * Created by yonixee on 15-11-3.
 */
$(function() {
  chrome.storage.local.get('shops', function(items) {
    if (!items) {
      return;
    }

    var data = items.shops;

    // 如果数据不存在, 忽略
    if (!data) {
      return;
    }

    var shops = {};
    for (var i = data.length; i--;) {
      var d = data[i];
      shops[d.id] = d;
    }

    var regx = /user_num_id=(\d+)/;
    // 自动填写暗号
    $('a.orderInfo-sellername').each(function (i, a) {
      var m = regx.exec(a.href);
      if (!m) return;
      var shopId = m[1];
      var shop = shops[shopId];
      if (!shop) return;
      $(a).parents('.order').find('textarea.memo-input').val(shop.remark);
    });

    // 清除数据
    chrome.storage.local.clear();
    // 提交订单
    console.log('do submit ... ', new Date());
    //doClick('J_Go');
  });
});