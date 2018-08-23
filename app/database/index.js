var Sequelize = require('sequelize')
var config = require('../config/index')

module.exports = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host, // 数据库地址
  port: config.db.port || 3306, // 数据库端口
  dialect: config.db.dialect, // 指定连接的数据库类型
  pool: {
    max: config.db.pool.max, // 连接池中最大连接数量
    min: config.db.pool.min, // 连接池中最小连接数量
    idle: config.db.pool.idle // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  }
})
