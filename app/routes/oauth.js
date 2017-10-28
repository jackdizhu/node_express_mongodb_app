

var express = require('express');
var router = express.Router();
var request = require('request');
// var request = require('https');

/* 微信登陆 */
/*
    JS接口安全域名修改
    设置JS接口安全域后，通过关注该测试号，开发者即可在该域名下调用微信开放的JS接口，请阅读微信JSSDK开发文档。
    域名
    jackdizhu.duapp.com

    授权回调页面域名:
    jackdizhu.duapp.com
    用户在网页授权页同意授权给公众号后，微信会将授权数据传给一个回调页面，回调页面需在此域名下，以确保安全可靠。沙盒号回调地址支持域名和ip，正式公众号回调地址只支持域名。
*/
var AppID = 'wxcf4e8c0aa7d2dfe3';
var AppSecret = '62f271afaa1a1ce4b27a0d37d5f37948';
router.get('/wx_login', function(req,res, next){
    //console.log("oauth - login")

    // 第一步：用户同意授权，获取code
    // var router = 'get_wx_access_token';
    var router = 'oauth/get_wx_access_token';
    // 这是编码后的地址
    // var return_uri = 'http%3A%2F%2Fwww.onelib.biz%2Foauth%2F'+router;  // 替换
    var return_uri = 'http%3A%2F%2Fjackdizhu.duapp.com%2F'+router;
    var scope = 'snsapi_userinfo';

    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');

});


router.get('/get_wx_access_token', function(req,res, next){
    //console.log("get_wx_access_token")
    //console.log("code_return: "+req.query.code)

    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    // var code = '001Bn1Dd1b7q7v04E9Dd1ChpDd1Bn1Dp';
    // res.send("\
    //     <h1>code: "+code+"</h1>\
    // ");

    request.get(
        {
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){

                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;

                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){

                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 小测试，实际应用中，可以由此创建一个帐户
                            res.send("\
                                <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                <p><img src='"+userinfo.headimgurl+"' /></p>\
                                <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                            ");

                        }else{
                            // 小测试，实际应用中，可以由此创建一个帐户
                            res.send("获取失败 . . 1");
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                // 小测试，实际应用中，可以由此创建一个帐户
                res.send("获取失败 . . 1");
                console.log(response.statusCode);
            }
        }
    );
});
module.exports = router;
