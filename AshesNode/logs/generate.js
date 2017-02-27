
var writeLog = require( './writeLog' ),
    errorCode = tools.require( 'config/errorCode' ),
    generate = {};

/**
 * @description 专门写入http日志
 */
generate.request = function( req, res, next ) {
    var o = {};
    o.type = 'request';
    o.desc = 'http请求报文';
    o.time = tools.day.timeSeconds();
    o.method = req.method;
    o.url = req.protocol + '://' + req.hostname + req.path;
    o.ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    o.params = req.params;
    o.body = req.body;
    o.query = req.query;
    o.cookie = req.cookies;

    writeLog.init( o, 1 );
    next();
};

generate.response = function( req, res, next ) {
    var o = {};
    o.type = 'response';
    o.desc = 'http响应报文';
    o.time = tools.day.timeSeconds();
    o.method = req.method;
    o.url = req.protocol + '://' + req.hostname + req.path;

    writeLog.init( o, 1 );
};

/**
 * @description 专门写入系统代码错误日志
 */
generate.error = function( data ) {
    var o = {}, i;
    o.type = 'error';
    o.time = tools.day.timeSeconds();

    // 遍历出自定义字段
    for ( i in data ) o[i] = data[i];
    o.code = o.code || -70000;

    // 如果msg没有值, 则用config配置的值
    if ( !o.msg ) {
        try {
            o.msg = errorCode[ 'error' ][ o.code ];
        } catch ( err ) {
            console.log( '错误编码值不存在', err );
        }
    }

    // 写入日志
    writeLog.init( o, 2 );
};

module.exports = generate;