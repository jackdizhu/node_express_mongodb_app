var crypto=require("crypto");

var log=require("./log.js");
var _aes=require("./aes.js");

//添加签名，防篡改
var secret="express_jackdizhu";


var token={
    createToken:function(obj,timeout){

        var obj2={
            data: obj,//payload
            created: parseInt(Date.now()/1000),//token生成的时间的，单位秒
            exp: parseInt(timeout) || 60*10//token有效期
        };

        //payload信息
        var base64Str=JSON.stringify(obj2);
        // aes 对称 加密
        base64Str = _aes.enCode(base64Str,'51ef7d6556208be091ff18a6ee2f4eba');

        var hash=crypto.createHmac('sha256',secret);
            hash.update(base64Str);
        var signature=hash.digest('base64');

        return  base64Str+"."+signature;
    },
    decodeToken:function(token){

        var decArr=token.split(".");
        if(decArr.length<2){
            //token不合法
            return false;
        }

        var payload={};

        //将payload json字符串 解析为对象
        var hash=crypto.createHmac('sha256',secret);
            hash.update(decArr[0]);
        var checkSignature=hash.digest('base64');

        decArr[0] = _aes.deCode(decArr[0],'51ef7d6556208be091ff18a6ee2f4eba');
        // aes 解密
        payload=JSON.parse(decArr[0]);

        return {
            payload:payload,
            signature:decArr[1],
            checkSignature:checkSignature
        }
    },
    checkToken:function(token){
        var resDecode=this.decodeToken(token);
        if(!resDecode){
            return false;
        }

        //是否过期
        var expState=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created))>parseInt(resDecode.payload.exp) ? false : true;
        if(resDecode.signature === resDecode.checkSignature && expState){
            return true;
        }

        return false;
    }

}
module.exports = token;
