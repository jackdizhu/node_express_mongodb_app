
# node_baiduGit node项目 部署 百度云

<!--http://jackdizhu.duapp.com-->
<!--http://jackdizhu.duapp.com/oauth/wx_login-->

<!--https://jackdizhu.github.io/node_express_mongodb_app/-->

\[一个 在线 收藏夹 项目\]
    浏览器 右键功能 全屏显示功能 图片上传裁剪 浏览器指纹采集
    服务器 express(ejs) + mongodb 登录 注册 修改密码 图片base64保存图片 token 生成(aes加密 + hash 防止篡改)

兼容 ie8+ (全屏功能除外...)

// 启动 mongodb

    mongod.exe --dbpath D:/mongodb/data/db/ --auth

// 启动 node

    node www.js

<!--
mongodb 用户名密码登录 配置  Mongodb3.0
db.createUser({"user":"root","pwd":"1234","customData":{employeeId:12345},"roles":[{role:"clusterAdmin",db:"admin"},{role:"readAnyDatabase",db:"admin"},"readWrite"]},{w:"majority",wtimeout:5000})
-->

// limit: '1000kb' 配置 req.body 大小限制 处理413 错误

    app.use(bodyParser.json({limit: '1000kb'}));
    app.use(bodyParser.urlencoded({ extended: false ,limit: '1000kb'}));


# dev_caipu_api 微信小程序服务端

* 服务端口 18080 sequelize 连接 mysql

```
// 生成数据 分类列表 随机推荐
/api/init
/api/get_list
/api/get_listRandom
/api/get_details
/api/global_dateData
```
