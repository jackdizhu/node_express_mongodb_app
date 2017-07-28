var
express = require('express'),
router = express.Router(),
fs = require('fs'),
crypto = require('crypto'),
log = require('../com/log.js'),
token = require('../com/token.js');

// Md5 key
var key = 'express_jackdizhu';

// 中间件 写在 app.js
router.get('/', function(req, res, next) {
    var _token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    var path = req.originalUrl;
    req.session._render = req.session._render || {};
    if(!_token || !token.checkToken(_token)){
        req.session._render.istoken = true;
    }else{
        req.session._render.istoken = false;
    }
    if(req.session.user){
      res.redirect("/user/index");
    }else{
      res.redirect("/user/login");
    }
    next();
});



module.exports = router;
