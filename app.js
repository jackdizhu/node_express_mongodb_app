
// var mongoose = require('mongoose');
// var dbHandel = require('./app/database/dbHandel');
// // v3.4.5 mongodb
// var db = mongoose.connect("mongodb://mongo.duapp.com:8908/cNYxkVbkVlHNxGIQfmje",{user : "800f12d44790464c8847b2cbbb084322",pass : "7f7183997de24edc988a5a81a428a3f1",auth : {authMechanism: 'SCRAM-SHA-1'}},function (err,data){
//     log({err: err ? err : 'mongoDB连接成功!'});
// });

// var MongoClient = require('mongodb').MongoClient;
// var MongoDB = 'mongodb://800f12d44790464c8847b2cbbb084322:7f7183997de24edc988a5a81a428a3f1@mongo.duapp.com:8908/cNYxkVbkVlHNxGIQfmje';

// var mongo = require('mongodb'),
//   Server = mongo.Server,
//   Db = mongo.Db;

// var express = require('express');



var http = require('http');
var port = 18080;
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var body = ' \
        <html> \
            <head> \
                <meta charset="utf-8"> \
                <title>Welcome to BAE</title> \
            </head> \
            <body> \
                <h4>Welcome to Baidu App Engine!</h4> \
                <h2>欢迎开启BAE之旅！</h2> \
                <br> \
                <br> \
                <ul>以下链接可能对您有用：</ul> \
                <ul><a href="https://bce.baidu.com/doc/BAE/QuickGuide.html" target="_blank">入门指南</a></ul> \
                <ul><a href="http://developer.baidu.com/forum/topic/list?boardId=66" target="_blank">论坛</a></ul> \
                <ul><a href="http://www.baeblog.com/" target="_blank">技术博客</a></ul> \
                <ul><a href="http://weibo.com/baiduappengine" target="_blank">微博</a></ul> \
                <ul><a href="https://bce.baidu.com/doc/BAE/FAQ.html" target="_blank">常见问题</a></ul> \
            </body> \
        </html> \
    ';
    res.write(body);
    res.end();
}).listen(port);
