var
express = require('express'),
router = express.Router(),
fs = require('fs'),
crypto = require('crypto'),
log = require('../com/log.js'),
token = require('../com/token.js');

// Md5 key
var key = 'express_jackdizhu';

/* POST register page. */
router.get('/', function(req, res, next) {
  var _render = {
      title: 'login',
      msg: '',
      data: req.session._render,
      username: ''
  };
  res.render('api', _render);
});
/* POST register page. */
router.post('/', function(req, res, next) {
  res.json({index: 'index'});
  res.end();
});

module.exports = router;
