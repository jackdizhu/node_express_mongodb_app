
var getBrowserInfo = function (req) {
    var ipAddress,browser = {};
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        browser.ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        browser.ipAddress = req.connection.remoteAddress;
    }
    // url
    browser.URL = req.url;
    // 浏览器信息
    browser.userAgent = req.headers['user-agent'];
    // 用户上一个链接请求
    browser.referer = req.headers['referer'];

    return browser;
};

module.exports = getBrowserInfo;
