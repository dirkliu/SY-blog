/**
 * @method loginService
 * @description 接入第三方服务
 */

var loginService = {},
    pool = APool(),
    co = require( 'co' );

loginService.checkUser = function( userName, cbHandle ) {

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return cbHandle( err, null );
        co(function *() {
            try {

                var doc, collectionUser = client.collection( 'users' );

                doc = yield collectionUser.findOne({
                    name: userName
                });

                if ( !doc ) throw '无此用户!';
                cbHandle( null, doc );

            } catch ( err ) {
                cbHandle({ code: -1, msg: err }, null );
            }
            pool.release( client );
        });

    });
};

module.exports = loginService;