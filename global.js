/**
 * @method returnFactory
 * @description 包装一层返回对象
 *
 * @param code code码
 * @param value msg信息
 */
global.returnFactory = function( code, value ) {

    var time = tools.day.timeSeconds();

    if ( tools.isObject( code ) ) {
        code.time = time;
        return code;
    }

    if ( code === 0 ) {
        return {
            code: 0, time: time, data: value
        };
    }

    return {
        code: code, time: time, msg: value
    };
};
