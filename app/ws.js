

    var log = require('./com/log.js'),
    token = require('./com/token.js'),
    cookie = require('cookie'),
    _WebSocket = require('ws');

    var _clients = {
        clients: {},
        length: 0
    };

    var W = new _WebSocket.Server({
            port: 8000,
            // 验证 token
            verifyClient: function (e) {
                var _cookie = cookie.parse(e.req.headers['cookie']);
                if(token.checkToken(_cookie.token)){
                    var _token = token.decodeToken(_cookie.token);
                    var name = _token.payload.data.username;
                    // 记录用户名
                    if(!_clients.clients[name]){
                        _clients.clients[name] = {};
                        _clients.clients[name].user = {
                            username: name
                        };
                        _clients.length++;
                    }

                    // _clients.client = e.req.client;
                    // client 绑定 用户名
                    e.req.client.username = name;

                    log({
                        err: 'checkToken name: '+token.checkToken(_cookie.token)
                    });
                    return true;
                }else{
                    log({
                        err: 'checkToken name: '+token.checkToken(_cookie.token)
                    });
                    return false;
                }

            }
        });

    W.sendMsg = function (data,_data) {
        W.clients.forEach(function (client,_w) {
            // 发给 单个用户
            if(_data.data.to){
                var to = _clients.clients[_data.data.to].user.username;
                // client._socket == e.req.client [ verifyClient 方法中的]
                var _username = client._socket.username;
                // 找到对应用户发送消息 readyState => 0 : 代表还没连接或正在连接,1 : 代表连接成功,2 : 代表正在关闭连接,3 : 代表连接关闭
                if((to == _username) && (client.readyState == 1)){
                    // log({
                    //     err: 'send' + _username
                    // });
                    client.send(data);
                    return false;
                }
            }else{
                if((_data.username != _username) && (client.readyState == 1)){
                    client.send(data);
                }
            }
            // client.send(data);
        });
    };
    // 获取用户列表 排除 user
    var getUsers = function (user){
        var users = [];
        for (var key in _clients.clients) {
            if(key != user){
                users.push(_clients.clients[key].user);
            }
        }
        return users;
    }
    // 客服端连接事件
    W.on('connection', function (client,req) {
        var _cookie = cookie.parse(req.headers['cookie']);
        var _token = token.decodeToken(_cookie.token);
        // 解析用户名
        var name = _token.payload.data.username;

        // 发送系统消息 所有用户
        var _data = {
            system: true,
            // username: name,
            clientsL:  _clients.length,
            users: getUsers(''),
            data: {
                form: 'system',
                to: null,
                txt: '',
                pull: null
            }
        };
        // 群发消息(当前用户除外)
        W.sendMsg(JSON.stringify(_data),_data);
        // 返回当前用户消息
        _data.username = name;
        client.send(JSON.stringify(_data))
        // 收到消息
        client
        .on('message', function (data) {

            var _D = JSON.parse(data);
            var _data = {
                system: false,
                username: name,
                clientsL:  _clients.length,
                users: getUsers(''),
                data: {
                    form: name,
                    to: _D.data.to,
                    txt: _D.data.txt,
                    pull: 'left'
                }
            };
            var str = JSON.stringify(_data);
            W.sendMsg(str,_data);
        })
        .on('close',function (){
            delete _clients.clients[name];
            _clients.length--;

            log({
                err: 'client close'
            });
        })
        .on('error',function (){
            delete _clients.clients[name];
            _clients.length--;

            log({
                err: 'client error'
            });
        })
        .on('ping',function (){
            log({
                err: 'client ping'
            });
        })
        .on('pong',function (){
            log({
                err: 'client pong'
            });
        })
    });
    W.on('close',function (){
        log({
            err: 'W close'
        });
    });




