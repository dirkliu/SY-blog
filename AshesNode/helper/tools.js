
var path = require('path');
var crypto = require( "crypto" );
var _toString = toString, tools = {}, isType;

// 生成基准类型
isType = function( o ) {
    return function( str ) {
        return _toString.call( str ) === "[object "+ o +"]";
    };
};
tools.isArray = isType( 'Array' );
tools.isObject = isType( 'Object' );
tools.isFunction = isType( 'Function' );
tools.isString = isType( 'String' );
tools.isBoolean = isType( 'Boolean' );
tools.isRegExp = isType( 'RegExp' );
tools.isElement = isType( 'HTMLDivElement' );

/**
 * @method tools.day
 * @description 时间格式化
 *
 * @method generate 生成基准时间对象
 * @method timeStamp 返回时间戳, 1486779531201
 * @method date 返回年月日, 2017-02-11
 * @method hours 返回时分秒, 10:18:51
 * @method seconds 返回毫秒, 204
 * @method timeSeconds 返回年月日-时分秒-毫秒, 2017-02-11 10:18:51:205
 * @method time 返回年月日-时分秒-毫秒, 2017-02-11 10:18:51
 *
 */
tools.day = {
    generate: function() {
        var time = new Date(),
            day = time.toJSON().split( 'T' )[0],
            hours = time.toTimeString().slice( 0, 8 ),
            getMilliseconds = time.getMilliseconds();

        return {
            timeStamp: +time,
            day: day,
            hours: hours,
            seconds: getMilliseconds
        }
    },
    timeStamp: function() {
        return this.generate().timeStamp;
    },
    date: function() {
        return this.generate().day;
    },
    hours: function() {
        return this.generate().hours;
    },
    seconds: function() {
        return this.generate().seconds;
    },
    timeSeconds: function() {
        var o = this.generate();
        return o.day + ' ' + o.hours + ':' + o.seconds;
    },
    time: function( timeStamp ) {
        var o = this.generate( timeStamp );
        return o.day + ' ' + o.hours;
    }
};

/**
 * @method md5
 * @description md5加密
 */
tools.md5 = function( options ) {
    options = options || '';
    var md5, result = '';

    if ( !options ) return result;

    if ( !tools.isString( options ) ) {
        options = JSON.stringify( options );
    }

    md5 = crypto.createHash( 'md5' );
    result = md5.update( options ).digest( 'hex' );
    return result;
};

// 生成随机字符串
tools.mathId = function( num ) {
    num = num || '0';
    var str = "xxxxx-xxxx-"+ num +"xxx-yxxx-xxxxxxxxx";

    return str.replace(/[xy]/g,function(c){
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
};

// 加载文件
tools.require = function( route ) {
    return require( path.join( process.cwd(), route ) );
};

// 过滤空参数{ null, undefined, '' }
tools.filterEmpty = function( options ) {
    var i;

    options = options || null;
    if ( !tools.isObject( options ) ) return {};

    for ( i in options ) {
        if ( options[i] === '' || options[i] === null || options[i] === undefined ) {
            delete options[i];
        }
    }
    return options;
};

// 判断是否为空 仅限于{ Array, Object, String }类型
tools.isEmptyValue = function( params ) {
    params = params || {};
    return Object.keys( params ).length;
};

// 获取ip
tools.ip = function( req ) {
    var clientIp = req.headers[ 'x-forwarded-for' ] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    return clientIp.slice( 7 );
};

global.tools = tools;
module.exports = tools;