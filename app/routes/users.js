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
// router.get('*', function(req, res, next) {
//     var _token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
//     var path = req.originalUrl;
//     req.session._render = req.session._render || {};
//     if(!_token || !token.checkToken(_token)){
//         req.session._render.istoken = true;
//     }else{
//         req.session._render.istoken = false;
//     }
//     next();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  var Link = global.dbHandel.getModel('link');
  if(req.session.user){
      var _render = {
          title: '首页',
          msg: '首页',
          data: req.session._render,
          username: req.session.user.name
      };
      var uname = req.session.user.name;
      Link.findOne({name: uname},function(err,doc){
          if(err){
              _render.links = [];
              res.render('index', _render);
          }else if (doc){
              log({
                err: doc
              });
              _render.links = doc.links;
              res.render('index', _render);
          }else{
              _render.links = [];
              res.render('index', _render);
          }
      });
  }else{
      // 重定向
      res.redirect("/user/login");
  }
});
/* GET login page. */
router.get('/login', function(req, res, next) {
  var _render = {
      title: 'login',
      msg: '',
      data: req.session._render,
      username: ''
  };
  res.render('login', _render);
});
/* GET register page. */
router.get('/register', function(req, res, next) {
  var _render = {
      title: 'register',
      msg: '',
      data: req.session._render,
      username: ''
  };
  res.render('register', _render);
});
/* POST register page. */
router.post('/register', function(req, res, next) {
  var User = global.dbHandel.getModel('user');

  // ?t=00 get参数
  var _query = req.query;
  // name=name,pwd=123 post参数
  var _body = req.body;

  var uname = req.body.username;
  var upwd = req.body.pwd;
  var upwd2 = req.body.pwd2;

  if(upwd != upwd2){
    var _render = {
        title: '注册',
        msg: '注册失败 04',
        username: uname
    };
    res.render('register', _render);
  }

  decipher = crypto.createHash('md5',key);
  upwd = decipher.update(upwd).digest('hex');

  User.findOne({name: uname},function(err,doc){
      if(err){
          var _render = {
              title: '注册',
              msg: '注册失败 01',
              username: uname
          };
          // 打印错误
          log({
            req: req,err: err
          });
          res.render('register', _render);
      }else if(doc){
          var _render = {
              title: '注册',
              msg: '用户名已存在 02',
              username: ''
          };
          res.render('register', _render);
      }else{
          User.create(
              {
                  name: uname,
                  password: upwd
              },
              function(err,doc){
                  if (err) {
                      var _render = {
                          title: '注册',
                          msg: '注册失败 03',
                          username: uname
                      };
                      res.render('register', _render);
                      // 打印错误
                      log({
                        req: req,err: err
                      });
                  } else {
                      var _render = {
                          title: '登录',
                          msg: '注册成功!',
                          username: uname
                      };
                      res.redirect("/user/login");
                    //   res.render('login', _render);
                  }
              }
          );
      }
  });
});
/* GET editPwd page. */
router.get('/editPwd', function(req, res, next) {
  if(req.session.user){
    var _render = {
        title: 'editPwd',
        msg: '',
        data: req.session._render,
        username: req.session.user.name
    };
    res.render('editPwd', _render);
  }else{
    res.redirect("/user/login");
  }
});
/* POST editPwd page. */
router.post('/editPwd', function(req, res, next) {
  var User = global.dbHandel.getModel('user');

  // ?t=00 get参数
  // var _query = req.query;
  // name=name,pwd=123 post参数
  var _body = req.body;

  var uname = req.body.username;
  var opwd = req.body.opwd;
  var upwd = req.body.npwd;
  var upwd2 = req.body.pwd2;

  log({
      err: req.body
  });

  if(upwd != upwd2){
    var _render = {
        title: '密码修改',
        msg: '密码修改失败 01',
        data: req.session._render,
        username: uname
    };
    res.render('editPwd', _render);
  }

  // 旧密码 加密
  decipher = crypto.createHash('md5',key);
  opwd = decipher.update(opwd).digest('hex');
  // 新密码 加密
  decipher = crypto.createHash('md5',key);
  upwd = decipher.update(upwd).digest('hex');

  User.findOne({name: uname,password: opwd},function(err,doc){
      if(err){
          var _render = {
              title: '密码修改',
              msg: '密码修改失败 02',
              data: req.session._render,
              username: uname
          };
          // 打印错误
          log({
            req: req,err: err
          });
          res.render('editPwd', _render);
      }else if(doc){
          User.update(
              {
                  name: uname,
                  password: opwd
              },
              {
                  name: uname,
                  password: upwd
              },
              function(err,doc){
                  if (err) {
                      var _render = {
                          title: '密码修改',
                          msg: '密码修改失败 03',
                          data: req.session._render,
                          username: uname
                      };
                      res.render('editPwd', _render);
                      // 打印错误
                      log({
                        req: req,err: err
                      });
                  } else {
                      var _render = {
                          title: '登录',
                          msg: '密码修改成功!',
                          data: req.session._render,
                          username: uname
                      };
                      res.redirect("/user/login");
                  }
              }
          );
      }else{
          var _render = {
              title: '密码修改',
              msg: '密码修改失败 03',
              data: req.session._render,
              username: uname
          };
          // 打印错误
          log({
            req: req,err: err
          });
          res.render('editPwd', _render);
      }
  });
});
/* POST login page. */
router.post('/login', function(req, res, next) {
  var User = global.dbHandel.getModel('user');

  // ?t=00 get参数
  var _query = req.query;
  // name=name,pwd=123 post参数
  var _body = req.body;

  var uname = req.body.username;
  var upwd = req.body.pwd;

  decipher = crypto.createHash('md5',key);
  upwd = decipher.update(upwd).digest('hex');

  User.findOne({name: uname,password: upwd},function(err,doc){
      if(err){
          var _render = {
              title: '登录',
              msg: '登录失败 01',
              data: req.session._render,
              username: uname
          };
          // 打印错误
          log({
            req: req,err: err
          });
          res.render('login', _render);
      }else if(doc){
          req.session.user = doc;
          var tok = {
              username: uname
          };

          try{
              var _token = token.createToken(tok);
          }catch(e){
              var _token = '';
          }

          // 设置 cookie token
          res.cookie('token', _token);
          req.session.msg = '登录成功!';
          // 重定向
          res.redirect("/user/");
      }else{
          var _render = {
              title: '登录',
              msg: '登录失败 03',
              data: req.session._render,
              username: uname
          };
          req.session.msg = '登录失败 03';
          res.render('login', _render);
      }
  });
});
/* POST saveLink */
router.post('/saveLink', function(req, res, next) {
    var User = global.dbHandel.getModel('user');
    var Link = global.dbHandel.getModel('link');
    var uname = req.session.user.name;
    var allLink = JSON.parse(req.body.allLink);
    if(req.session.user){

      Link.findOne({name: uname},function(err,doc){
        if(err){
            // 打印错误
            log({
              req: req,err: err
            });
            res.json({
              data: allLink,
              type: 'err',
              msg: '保存失败 01'
            });
        }else if(doc){
            Link.update(
                {
                    name: uname
                },
                {
                    name: uname,
                    links: allLink.link
                },
                function(err,doc){
                    if (err) {
                        // 打印错误
                        log({
                          req: req,err: err
                        });
                        res.json({
                          data: allLink,
                          type: 'err',
                          msg: '保存失败 02'
                        });
                    } else {
                        res.json({
                          data: doc,
                          type: 'ok',
                          msg: '保存成功'
                        });
                    }
                }
            );
        }else{
            Link.create(
                {
                    name: uname,
                    links: allLink.link
                },
                function(err,doc){
                    if (err) {
                        // 打印错误
                        log({
                          req: req,err: err
                        });
                        res.json({
                          data: allLink,
                          type: 'err',
                          msg: '保存失败 02'
                        });
                    } else {
                        res.json({
                          data: doc,
                          type: 'ok',
                          msg: '保存成功'
                        });
                    }
                }
            );
        }
      });

    }else{

      res.json({
        data: allLink,
        type: 'err',
        msg: '保存失败 04'
      });

    }
})
/* POST imgUpload */
router.post('/imgUpload', function(req, res, next) {
    var data = JSON.parse(req.body.data);
    if(req.session.user){

        var base64Data = data.imageData.split(';');
        var _jpg = '.' + base64Data[0].split('/')[1];
        var _data = base64Data[1].replace(/base64,/,'');
        var _b = new Buffer(_data,'base64');
        var name = (new Date()).getTime() + _jpg;
        var _path = global._appPath + '/public/data/img/' + name;

        fs.writeFile(_path, _b, function(err) {
          if(err){
            res.json({
              data: '/data/img/' + name,
              type: 'err',
              msg: '保存失败 01'
            });
          }else{
            res.json({
              data: '/data/img/' + name,
              type: 'ok',
              msg: '保存成功 01'
            });
          }
        });
    }else{
      res.json({
        data: '/data/img/' + name,
        type: 'err',
        msg: '保存失败 02'
      });
    }
})

module.exports = router;
