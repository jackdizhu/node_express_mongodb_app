var
express = require('express'),
router = express.Router(),
fs = require('fs'),
crypto = require('crypto'),
log = require('../com/log.js'),
token = require('../com/token.js');
var cookingModel = require('../models/cooking')
var moment = require('moment')
var pagesize = 35

var cookingType = ['chuancai', 'xiangcai', 'yuecai', 'dongbeicai', 'lucai', 'zhecai', 'sucai', 'qingzhencai', 'mincai', 'hucai', 'jingcai', 'hubeicai', 'huicai', 'yucai', 'xibeicai', 'yunguicai', 'jiangxicai', 'shanxicai', 'guangxicai', 'gangtaicai', 'qitacai']
var random = (min, max) => {
  var R = Math.floor(Math.random() * (max - min)) + min
  return R
}
// 生成 随机推荐数据
function get_listRandom (_obj) {
  return new Promise((resolve, reject) => {
    var arr = global.dateData.listRandom = []
    var _pagesize = 1
    var page = 1
    for (var i = 0; i < cookingType.length; i++) {
      (function (i) {
        var item = cookingType[i]
        cookingModel.count({type: item}).then(function (count) {
          count = count[0].get('count')
          page = random(1, count + 1)
          cookingModel.find({type: item}, _pagesize, page).then(function (data) {
            arr.push(data[0])
            if (i === (cookingType.length - 1)) {
              resolve(true)
            }
          })
        })
      })(i)
    }
    // resolve(true)
    // return true
  })
}
// 生成 菜系数据
function get_list (_obj) {
  return new Promise((resolve, reject) => {
    var page = 1
    for (var i = 0; i < cookingType.length; i++) {
      (function (i) {
        var item = cookingType[i]
        cookingModel.count({type: item}).then(function (count) {
          count = count[0].get('count')
          var maxPage = Math.ceil(count / pagesize)
          var _page = _obj[item] && _obj[item].page
          page = _page ? (_page + 1) : 1
          if (page > maxPage) {
            page = 1
          }
          cookingModel.find({type: item}, pagesize, page).then(function (data) {
            global.dateData[item] = {}
            global.dateData[item].page = page
            global.dateData[item].data = data
            if (i === (cookingType.length - 1)) {
              resolve(true)
            }
          })
        })
      })(i)
    }
    // resolve(true)
    // return true
  })
}

function init_dateData (dateStr) {
  return new Promise((resolve, reject) => {
    var resolveNum = 0
    var thisDate = dateStr || moment().format('YYYY-MM-DD')
    if (global.dateData && global.dateData[thisDate]) {
      resolve(global.dateData)
      // return global.dateData
    } else {
      var _obj = global.dateData
      global.dateData = {}
      global.dateData[thisDate] = true
      get_listRandom(_obj).then(function (res) {
        resolveNum += 1
        if (resolveNum === 2) {
          resolve(global.dateData)
        }
        // console.log(global.dateData.listRandom, 222);
      })
      get_list(_obj).then(function (res) {
        resolveNum += 1
        if (resolveNum === 2) {
          resolve(global.dateData)
        }
      })
      // resolve(global.dateData)
      // return global.dateData
    }
  })
}

// Md5 key
var key = 'express_jackdizhu';


router.get('/global_dateData', function (req, res, next) {
  var body = {
    'title': '/',
    'code': '0',
    'msg': '成功.',
    'data': global.dateData
  }
  res.json(body);
  res.end();
});
router.get('/init', function (req, res, next) {
  var dateStr = req.query.dateStr || moment().format('YYYY-MM-DD')
  var item = cookingType[0]
  init_dateData(dateStr).then(function (obj) {
    // console.log(obj, 111)
    var body = {
      'title': '/',
      'code': '0',
      'msg': '成功.',
      'data': obj && dateStr
    }
    res.json(body);
    res.end();
  })
});
router.get('/get_list', function (req, res, next) {
  var thisDate = moment().format('YYYY-MM-DD')
  var cookingType = req.query.cookingType || 'chuancai'
  var page = req.query.page || 1
  var data = null

  if (global.dateData && global.dateData[thisDate] && global.dateData[cookingType] && global.dateData[cookingType].data && global.dateData[cookingType].data.length) {
    data = global.dateData[cookingType].data
    var body = {
      'title': 'get_list',
      'code': '0',
      'msg': '成功.',
      'data': data
    }
    res.json(body);
    res.end();
  } else {
    cookingModel.find({type: cookingType}, pagesize, page).then(function (arr) {
      data = arr
      var body = {
        'title': 'get_list',
        'code': '0',
        'msg': '成功.',
        'data': data
      }
      res.json(body);
      res.end();
    })
  }
})

router.get('/get_listRandom', function (req, res, next) {
  var thisDate = moment().format('YYYY-MM-DD')
  var pagesize = 1
  var page = req.query.page || 1
  var data = null

  function getData () {
    return new Promise((resolve, reject) => {
      var arr = []
      for (var i = 0; i < cookingType.length; i++) {
        (function (i) {
          var item = cookingType[i]
          cookingModel.count({type: item}).then(function (count) {
            count = count[0].get('count')
            page = random(1, count + 1)
            cookingModel.find({type: item}, pagesize, page).then(function (data) {
              arr.push(data[0])
              if (i === (cookingType.length - 1)) {
                resolve(arr)
              }
            })
          })
        })(i)
      }
      // return arr
    })
  }

  if (global.dateData && global.dateData[thisDate] && global.dateData.listRandom && global.dateData.listRandom.length) {
    data = global.dateData.listRandom
    var body = {
      'title': 'get_list',
      'code': '0',
      'msg': '成功.',
      'data': data
    }
    res.json(body);
    res.end();
  } else {
    getData().then(function (arr) {
      data = arr
      var body = {
        'title': 'get_list',
        'code': '0',
        'msg': '成功.',
        'data': data
      }
      res.json(body);
      res.end();
    })
  }
})

router.get('/get_details', function (req, res, next) {
  var id = req.query.id
  var data = null

  cookingModel.findOne({id: id}).then(function (arr) {
    data = arr
    var body = {
      'title': 'get_list',
      'code': '0',
      'msg': '成功.',
      'data': data
    }
    res.json(body);
    res.end();
  })
})

/* POST register page. */
router.post('/', function(req, res, next) {
  res.json({index: 'index'});
  res.end();
});

module.exports = router;
