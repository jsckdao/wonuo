/**
 * Created by yonixee on 15/11/2.
 */

(function($) {

  function click(fireOnThis) {
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent( 'click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
    fireOnThis.dispatchEvent(evObj);
  };

  var formTmpl =
    '<div><div class="wonuo-panel line">' +
    '<h2>设置抢单时间</h2>' +
    '<em>(选定时间后, 等待时间到达会自动完成下单)</em><br /><br />' +
    '<input name="hour" type="number" min="0" max="23" value="22" />时' +
    '<input name="minute" type="number" min="0" max="59" value="0" />分' +
    '<input name="second" type="number" min="0" max="59" value="0" />秒' +
    '</div><div class="display"></div>' +
    '</div>';

  var settingWindow = {

    // 已选中的商品
    _selectItems: [],

    // 设置暗号
    _codes: {},

    // 抢单时间
    _time: {
      hour: 22,
      minute: 22,
      second: 22
    },

    /**
     * 初始化购物车
     */
    initSelection: function() {
      var self = this;
      $('input.J_CheckBoxItem').change(function() {
        if (this.checked) {
          self.selectItem(this.value);
        }
        else {
          self.unselectItem(this.value);
        }
      }).change();
    },

    selectItem: function(id) {
      if (this._selectItems[id]) {
        return;
      }
      var item = $('#J_Item_' + id);
      var bundle = item.parents('.order-content');
      var code = this._selectItems[id] = bundle.attr('id');

      if (!this._codes[code]) {
        var op = this._codes[code] = {
          el: bundle,
          remark: '',
          frame: this.createRemarkFrame(bundle, function(remark) {
            op.remark = remark;
          })
        };
      }
    },

    createRemarkFrame: function(bundle) {
      var frame = $('<div class="wonuo-remark"><label>预先设置卖家留言</label><input type="text"></div>');
      setTimeout(function() {
        bundle.after(frame);
      }, 1000);
    },

    unselectItem: function(id) {

    },

    /**
     * 初始化时间控件
     */
    initTimeInput: function() {
      var self = this;
      var _handle = null;
      this._window.find('input[type=number]').change(function() {
        var input = this;
        // 保证填写的值合法
        var v = parseInt(input.value) || 0,
          min = parseInt(input.min), max = parseInt(input.max);
        input.value = self._time[input.name] = Math.min(Math.max(min, v), max);

        // 设置完成后1.5秒后自动重新设置计时器
        if (_handle) {
          clearTimeout(_handle);
        }
        _handle = setTimeout(function() {
          self.resetTimer();
        }, 1500);

      }).focus(function() {
        // 当用户输入时间时, 停止计时器, 等待用户输入
        self.stopTimer();
        self.displayStatus('等待您的输入...');
      });
    },

    /**
     * 重置计时器
     */
    resetTimer: function() {
      this.stopTimer();
      // 如果发现没有选择任何东西
      if (this._selectItems.length < 1) {
        this.displayStatus('请在购物车中勾选需要抢的东西');
        return;
      }
      var time = new Date(), now = new Date();
      var t = this._time;
      var self = this;
      time.setHours(t.hour, t.minute, t.second);
      var d = time.getTime() - now.getTime();
      // 如果选择时间小于当前时间, 就认为这是第二天的时间
      if (d <= 0) {
        d += 24 * 3600 * 1000;
      }
      this.displayStatus('已经打起来十二分精神 ');
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

    },

    /**
     * 提交订单
     */
    submit: function() {

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
      this.initSelection();
      this.initTimeInput();
    },

    /**
     * 进入禁用状态
     */
    disable: function() {
      var self = this;
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
      console.log('plugin init .....')
    }
  };


  settingWindow.init();
})(jQuery);