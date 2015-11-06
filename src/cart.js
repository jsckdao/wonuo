/**
 * Created by yonixee on 15/11/2.
 */

$(function() {

  var formTmpl =
    '<div><div class="wonuo-panel line">' +
    '<h2>设置抢单时间</h2>' +
    '<em>(选定时间后, 等待时间到达会自动完成下单)</em><br /><br />' +
    '<input name="hour" type="number" class="input" min="0" max="23" value="22" />时' +
    '<input name="minute" type="number" class="input" min="0" max="59" value="0" />分' +
    '<input name="second" type="number" class="input" min="0" max="59" value="0" />秒' +
    '</div><div class="display">双十一快到了, 插件君表示压力好大... ( >﹏< )</div>' +
    '</div>';

  var storage = window.sessionStorage;

  function getShopId(shopContainer) {
    var id = shopContainer.attr('id');
    var arr = id.split('_');
    return arr[3];
  }

  var settingWindow = {


    /**
     * 初始化购物车
     */
    initSelection: function() {
      var self = this;
      $('#content').css('position', 'relative');

      var lop = lazyOperate(1500);

      var _handle = function() {
        var tag = this;
        if (tag.tagName.toLowerCase() == 'input' ||
          tag.className == 'J_CheckBoxItem') {
          // 判断是否是勾选
          if (this.checked) {
            var result = self.selectItem(this.value);
          }
          else {
            var result = self.unselectItem(this.value);
          }

          // 查看处理结果
          if (result) {
            lop.run(function() {
              self.resetTimer();
            });
          }
        }
      };

      this._refresh_checkbox_handle = setInterval(function() {
        $('input.J_CheckBoxItem').each(function(i, e) {
          if (e._change_handle) {
            return;
          }
          e._change_handle = _handle;
          $(e).change(_handle).change();
        })
      }, 500);

    },

    /**
     * 清除各种选择事件
     */
    destroySelection: function() {
      // 剔除事件循环
      clearInterval(this._refresh_checkbox_handle);
      // 剔除所有安插的侦听器
      $('input.J_CheckBoxItem').each(function(i, e) {
        if (e._change_handle) {
          $(e).unbind('change', e._change_handle);
          delete e._change_handle;
        }
      });

      // 移除接头暗号输入框
      for (var k in this._shops) {
        if (this._shops.hasOwnProperty(k)) {
          this._shops[k].frame.remove();
        }
      }
    },

    /**
     * 选择一件商品
     * @param id
     */
    selectItem: function(id) {
      if (this._selectItems[id]) {
        return false;
      }
      var el = $('#J_Item_' + id);
      var shopContainer = el.parents('.order-content').parent();
      var shopId = getShopId(shopContainer);

      // 如果不存在指定商铺信息, 新建商铺信息
      var shop = this._shops[shopId];
      if (!shop) {
        shop = this._shops[shopId] = {
          id: shopId,
          remark: null,
          selItemsCount: 0,
          frame: this.createRemarkFrame(shopContainer, function(remark) {
            shop.remark = remark;
          })
        };
      }

      this._selectItems[id] = {
        id: id,
        shop: shop
      };
      shop.selItemsCount++;
      this._selectCount++;
      return true;
    },

    /**
     * 取消选择
     * @param id
     */
    unselectItem: function(id) {
      if (!this._selectItems[id]) {
        return false;
      }
      var item = this._selectItems[id];

      // 检查店铺信息是否已经没有商品了, 如果是, 移除这个商铺信息
      if (--item.shop.selItemsCount < 1) {
        var shop = this._shops[item.shop.id];
        shop.frame.remove();
        delete this._shops[shop.id];
      }

      delete this._selectItems[id];
      this._selectCount--;
      return true;
    },

    /**
     * 创建暗号输入框
     * @param bundle
     */
    createRemarkFrame: function(shopContainer, callback) {
      var b = shopContainer[0];
      var parent = b.offsetParent;
      var frame = $('<div class="wonuo-remark"><label>接头暗号:</label><input class="input" type="text"></div>').appendTo(parent);
      var input = frame.find('input');
      var f = frame[0];

      frame.css({
        right: '5px',
        top: (b.offsetTop + b.offsetHeight - f.offsetHeight - 5) + 'px'
      });

      input.change(function() {
        callback && callback(this.value);
      });
      return frame;
    },


    /**
     * 初始化时间控件
     */
    initTimeInput: function() {
      var self = this;
      var lop = lazyOperate(1500);

      this._window.find('input[type=number]').each(function(i, input) {
        input.value = self._time[input.name];
      }).blur(function() {
        var input = this;
        if (input._beforeValue != input.value) {
          // 保证填写的值合法
          var v = parseInt(input.value) || 0,
            min = parseInt(input.min), max = parseInt(input.max);
          input.value = self._time[input.name] = Math.min(Math.max(min, v), max);

          // 设置完成后1.5秒后自动重新设置计时器
          lop.run(function() {
            self.resetTimer();
          });
        }

      }).focus(function() {
        lop.clear();
        var input = this;
        input._beforeValue = input.value;
        // 当用户输入时间时, 停止计时器, 等待用户输入
        self.stopTimer();
        self.displayStatus('不急不急, 慢慢设置... <(▰˘◡˘▰)>');
      });
    },

    /**
     * 重置计时器
     */
    resetTimer: function() {
      this.stopTimer();
      // 如果发现没有选择任何东西
      if (this._selectCount < 1) {
        this.displayStatus('你至少得勾选一件东西吧... (>_<)');
        return;
      }
      var time = new Date(), now = new Date();
      var t = this._time;
      var self = this;
      time.setHours(t.hour, t.minute, t.second, 0);
      var d = time.getTime() - now.getTime();
      // 如果选择时间小于当前时间, 就认为这是第二天的时间
      if (d <= 0) {
        d += 24 * 3600 * 1000;
      }
      // console.log('time:', time);
      this.displayStatus('插件君已经打起了十二分精神! (^0_0^)');
      //
      this._timer_handle = setTimeout(function() {
        self.submit();
      }, d);
    },

    /**
     * 停止计时器
     */
    stopTimer: function() {
      if (this._timer_handle) {
        clearTimeout(this._timer_handle);
        this._timer_handle = null;
      }
    },

    /**
     * 显示状态
     */
    displayStatus: function(text) {
      this._display.html(text);
    },

    /**
     * 提交订单
     */
    submit: function() {
      console.log('start submit .......', new Date());
      var arr = [];
      for (var k in this._shops) {
        if (this._shops.hasOwnProperty(k)) {
          var s = this._shops[k];
          arr.push({
            id: s.id,
            remark: s.remark
          });
        }
      }

      chrome.storage.local.set({ shops: arr });
      doClick('J_Go');
    },

    /**
     * 进入启用状态
     */
    enable: function() {
      var content = $(formTmpl);
      var self = this;
      var disableBtn = $('<button class="close">X</button>').click(function() {
        self.disable();
      });
      this._window.html(content);
      this._window.append(disableBtn);
      this._display = this._window.find('.display');
      this._time = {
        hour: 22,
        minute: 10,
        second: 10
      };

      // 已选中的商品
      this._selectItems = {};

      // 已选择的商品数量
      this._selectCount = 0;

      // 与已选中的商品相关的店铺信息
      this._shops = {};

      this.initSelection();
      this.initTimeInput();
    },

    /**
     * 进入禁用状态
     */
    disable: function() {
      var self = this;
      this.destroySelection();
      var enbaleBtn = $('<a href="javascript:;">抢</a>').click(function() {
        self.enable();
      });

      this._window.html(enbaleBtn);
    },

    /**
     * 初始化
     */
    init: function() {
      this._window = $('<div class="wonuo-swindow" />').appendTo(document.body);
      this.disable();
    }
  };


  settingWindow.init();


  $(window).bind('unload', function() {
    console.log('unload');
  });
});