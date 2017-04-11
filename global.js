
var code = tools.require( 'config/errorCode' ),
    logs = tools.require( 'AshesNode/logs/generate' ),
    httpCode = code[ 'http' ],
    errorCode = code[ 'error' ];

global.writeLogs = logs;

/**
 * @method returnFactory
 * @description 包装一层返回对象
 *
 * @param code code码
 * @param value msg信息
 *
 * res.json( returnFactory( 'YUHKJWAD1545756456578' ) );
 * res.json( returnFactory( 0, true ) );
 * res.json( returnFactory( -1, '领取时间过期' ) );
 * res.json( returnFactory( { code: 0, data: { token: '1234' }, total: 200, page: 1, pageSize: 10 } ) );
 */
global.returnFactory = function( code, value ) {

    var arg = Array.prototype.slice.call( arguments ),
        _toString = Object.prototype.toString,
        returnJson = { code: 0, msg: '', data: '', time: (+ new Date()) };

    if ( !arg.length ) return returnJson;

    // 只有一个参数永远是成功
    if ( arg.length === 1 ) {
        if ( _toString.call( code ) === '[object Object]' ) {
            for ( var i in code ) {
                returnJson[i] = code[i];
            }
        } else {
            returnJson.data = code;
        }
    }

    if ( arg.length === 2 ) {
        returnJson.code = code;
        if ( code ) {
            returnJson.msg = value;
        } else {
            returnJson.data = value;
        }
    }

    return returnJson;
};

global.httpResponse = {
    error: function( code, msg ) {

        msg = msg || httpCode[ code ];

        this.status( code ).json({
         code: code,
         time: + new Date(),
         msg: msg
         });
        /*this.render( "common/error", {
            title: '-错误信息',
            message: msg
        })*/
    }
};

