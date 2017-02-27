
var route = {};
var http = require('http');

var getIpInfo = function(ip, cb) {
    var sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    var url = sina_server + ip;
    http.get(url, function(res) {
        var code = res.statusCode;
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    cb(null, JSON.parse(data));
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code: code });
        }
    }).on('error', function(e) { cb(e); });
};

route[ 'init' ] = function( req, res ) {

    var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var ip = clientIp.slice(7);


    getIpInfo(ip, function(err, msg) {
        console.log( "******************************ip:" + ip + "|城市：" + msg.city );
        res.render('socket/index', {
            title: '学习socket',
            clientIp: ip,
            city: msg.city
        });
    });
};

module.exports = route;