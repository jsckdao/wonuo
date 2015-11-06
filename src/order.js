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

    // 开始循环检查页面是否准备就绪
    var _handle = setInterval(function() {
      var a = $('a.orderInfo-sellername');

      if (a.length > 0) {
        var shops = {};
        for (var i = data.length; i--;) {
          var d = data[i];
          shops[d.id] = d;
        }

        var regx = /user_num_id=(\d+)/;
        // 自动填写暗号

        a.each(function (i, a) {
          var m = regx.exec(a.href);
          if (!m) return;
          var shopId = m[1];
          var shop = shops[shopId];
          if (!shop) return;
          var textarea = $(a).parents('.order').find('textarea.memo-input');
          if (textarea.length > 0) {
            doFocus(textarea[0]);
            textarea.val(shop.remark);
            doBlur(textarea[0]);
          }
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
});