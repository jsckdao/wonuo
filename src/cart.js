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
    '<input name="hour" type="number" min="0" max="23" value="22">时' +
    '<input name="minute" type="number" min="0" max="59" value="0">分' +
    '<input name="second" type="number" min="0" max="59" value="0">秒' +
    '</div>' +
    '</div>';

  var settingWindow = {

    // 已选中的商品
    _selectItems: {},

    // 设置暗号
    _codes: {},

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

    initTimeInput: function() {

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

    init: function() {
      this._window = $('<div class="wonuo-swindow" />').appendTo(document.body);
      this.disable();
      console.log('plugin init .....')
    }
  };


  settingWindow.init();
})(jQuery);