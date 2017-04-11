
var writeLog = require( '../../AshesNode/logs/generate' );

/**
 * @method initialize
 * @description 权限验证
 * @param {Number} authority 当前接口权限码
 * @returns {Function} http请求信息
 */
module.exports = function( authority ) {
    return function( req, res, next ) {

        var isPass = false, role;

        try {
            // 从token中获取用户信息
            role = req.user.role;

            // 遍历用户接口权限码
            if ( tools.isArray( role ) ) {
                role.forEach(function( userAuthority ) {
                    if ( userAuthority === authority ) {
                        return ( isPass = true );
                    }
                });
            }
        } catch ( err ) {
            writeLog.error({
                code: -71001,
                desc: 'token有可能不存在',
                msg: err.toString()
            });
        }

        if ( isPass ) {
            return next();
        } else {
            //return httpResponse.error.call( res, -1007 );
            return res.json( returnFactory( -1007, "权限不够" ) );
        }
    };
};