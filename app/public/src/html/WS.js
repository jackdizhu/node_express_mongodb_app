(function () {
    var W;
    var WS = {
        open:function (O) {
            var
                _onOpen = O.onopen || null,
                _onClose = O.onclose || null,
                _onMsg = O.onmessage || null,
                _onError = O.onerror || null;

            if ("WebSocket" in window){
                // 打开一个 web socket
                W = new WebSocket('ws://127.0.0.1:8000?key=132456&');

                W.onopen = function(){
                    // console.log("WebSocket: 连接已打开...");
                    if(_onOpen){
                        _onOpen();
                    }
                };
                W.onmessage = function (e) {
                    var msg = e.data;
                    var _data = JSON.parse(msg);
                    // console.log("WebSocket: 数据已接收...");
                    if(_onMsg){
                        _onMsg(_data);
                    }
                };
                W.onerror = function(){
                    // console.log(arguments);
                    var _arg = arguments;
                    if(_onError){
                        _onError(_arg);
                    }
                };
                W.onclose = function(){
                    // console.log("WebSocket: 连接已关闭...");
                    if(_onClose){
                        _onClose();
                    }
                };
            }else{
               console.log("WebSocket: 不支持");
            }
        },
        sendMsg: function (data) {
              W.send(data);
              // console.log("WebSocket: 数据发送中...");
        },
        // init: function () {
        //     this.open();
        // }
    };

    // WS.init();

    module.exports = WS;

}());

