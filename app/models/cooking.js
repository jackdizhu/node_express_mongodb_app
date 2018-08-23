'use strict'
var Sequelize = require('sequelize')
var Cooking = require('./index').Cooking

// 添加新用户
// exports.insert = function (Obj) {
//   var _id = Obj._id
//   var __v = Obj.__v
//   var target = Obj.target
//   var img = Obj.img
//   var typeName = Obj.typeName
//   var type = Obj.type
//   var name = Obj.name
//   var data = Obj.data
//   var dataString = ''
//   try {
//     dataString = JSON.stringify(data)
//   } catch (error) {
//     dataString = ''
//   }
//   // 向 Cooking 表中插入数据
//   return Cooking.create({
//     "id" : _id,
//     "__v" : __v,
//     "target" : target,
//     "img" : img,
//     "typeName" : typeName,
//     "type" : type,
//     "name" : name,
//     "data" : dataString
//   })
// }

// 通过用户名查找用户
exports.findOne = function (where) {
  return Cooking.findOne({
    where: where
  })
}

// 通过用户名查找用户
exports.find = function (where, limit, page) {
  limit = limit || 10
  page = page || 1
  return Cooking.findAll({
    where: where,
    limit: limit,
    offset: limit * (page - 1)
  })
}

// 统计数量
exports.count = function (where) {
  return Cooking.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    where: where
  })
  // return count[0] && count[0].get && count[0].get('count')
}

// 通过 ID 查找
exports.findById = function (id) {
  return Cooking.findById(id)
}

// 通过 ID 查找
exports.update = function (Cooking) {
  return Cooking.update({
    data: Cooking.data,
    name: Cooking.name,
    type: Cooking.type,
    typeName: Cooking.typeName,
    img: Cooking.img,
    target: Cooking.target
  }, {
    where: {
      id: Cooking.id
    }
  })
}

// 通过 ID 查找
// exports.delete = function (Cooking) {
//   return Cooking.destroy({
//     where: {
//       id: Cooking.id
//     }
//   })
// }
