
var fs = require('fs');

var filename = './log/log.js';

var logger = function (Obj) {
    var data = new Date().toLocaleString() + '--\n  ' +  JSON.stringify(Obj) + '\n';
    fs.appendFile(filename, data, {encoding:'utf-8'}, function () {
        console.log('写入文件成功! ');
    });
};
var getBrowserInfo = require('./getBrowserInfo.js');

var log = function (Obj) {
    var req = Obj.req || null;
    var _log = {};
    if(req){
      _log.ip = getBrowserInfo(req);
    }
    _log.err = Obj.err;
    _log.debug = Obj.debug;

    logger(_log);
}

module.exports = log;
