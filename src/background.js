/**
 * Created by yonixee on 15-11-3.
 */
(function() {
  var _data = [{
    id: '646877444',
    remark: '这是化妆品店的留言'
  }, {
    id: '78997203',
    remark: '这是皮具店的暗号'
  }];

  var lop = lazyOperate(20000);

  setCallHandle('putData', function(e) {
    _data = e.message;
    //op.run(function() {
    //  _data = null;
    //});
  });


  setCallHandle('getData', function(e) {
    return _data;
  });

  setCallHandle('clearData', function(e) {
    _data = null;
  });

})();