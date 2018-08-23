// module.exports = {
//   'port': 8000,
//   'db': {
//     database: 'HBpWrRKptMxFBTLxUGYL',
//     username: '800f12d44790464c8847b2cbbb084322',
//     password: '7f7183997de24edc988a5a81a428a3f1',
//     host: 'sqld.duapp.com',
//     port: '4050',
//     dialect: 'mysql',
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000
//     }
//   },
//   'jwt': {
//     'key': 'user',
//     'expire': '14 days',
//     'collection': 'tokens',
//     'secret': 'shared-secret'
//   }
// }
module.exports = {
  'port': 8000,
  'db': {
    database: 'nodemysql',
    username: 'root',
    password: 'root',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  'jwt': {
    'key': 'user',
    'expire': '14 days',
    'collection': 'tokens',
    'secret': 'shared-secret'
  }
}
