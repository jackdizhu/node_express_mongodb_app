var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var _api = require('./routes/api');
var users = require('./routes/users');

var app = express();
var session = require('express-session');
var token = require('../app/com/token.js');

var log = require('./com/log.js');
var getBrowserInfo = require('./com/getBrowserInfo.js');

var mongoose = require('mongoose');
global.dbHandel = require('./database/dbHandel');
// v3.4.5 mongodb

if(process.env.BAE_ENV_APPID){
    // 服务器数据库
    global.db = mongoose.connect("mongodb://mongo.duapp.com:8908/cNYxkVbkVlHNxGIQfmje",
      {user : "fdf172d6419d42799d02f5d8df0edd95",pass : "da8558d465044ee4bd65d88dee13d72f"},
      function (err,data){
        log({err: err ? err : 'mongoDB连接成功!'});
      });
}else{
    // 本地数据库
    global.db = mongoose.connect("mongodb://127.0.0.1:27017/nodedb",
      {user : "root",pass : "1234",auth : {authMechanism: 'SCRAM-SHA-1'}},
      function (err,data){
        log({err: err ? err : 'mongoDB连接成功!'});
      });
}

global._appPath = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// limit: '1000kb' 配置 req.body 大小限制 处理413 错误
app.use(bodyParser.json({limit: '1000kb'}));
app.use(bodyParser.urlencoded({ extended: false ,limit: '1000kb'}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// 配置 / 路由 不访问 index.html
app.use(express.static(path.join(__dirname, 'public'),{'index': false}));

app.use(session({
    secret: 'secret',
    cookie:{
        maxAge: 1000*60*30,
    }
}));

app.use(function(req,res,next){
    res.locals.user = req.session.user;   // 从session 获取 user对象

    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    // 定义 session._render 属性
    req.session._render = req.session._render || {
        istoken: false
    };

    next();  //中间件传递
});

// Fingerprint2ID 获取浏览器指纹
app.use(function(req,res,next){
    // 获取浏览器 指纹信息
    var Fingerprint2ID = req.body.Fingerprint2ID || req.query.Fingerprint2ID || req.cookies.Fingerprint2ID || '';
    req.session._render.Fingerprint2ID = Fingerprint2ID;

    next();  //中间件传递
});

// getBrowserInfo 获取浏览器ip地址
app.use(function(req,res,next){
    // 获取浏览器信息
    var _BrowserInfo = getBrowserInfo(req);
    req.session._render.BrowserInfo = _BrowserInfo;

    next();  //中间件传递
});

// token 验证
app.use(function(req,res,next){
    // 请求路径
    req.session._render.path = req.originalUrl;
    // 获取token
    var _token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token || '';

    if(!_token || !token.checkToken(_token)){
        req.session._render.istoken = false;
        log({
          debug: req.session._render,
        });
        next();  //中间件传递
    }else{
        req.session._render.istoken = true;
        log({
          debug: req.session._render,
        });
        next();  //中间件传递
    }
});

// 路由
app.use('/api', _api);

app.use('/', index);
app.use('/user', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // console.log(req.path);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
