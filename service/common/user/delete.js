
var userDeleteService,
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' );

/**
 * @method userDeleteService
 * @description 删除用户
 * @param {Object} id
 * @param {Function} callback 查询成功的回调
 */
userDeleteService = function( id, callback ) {

    if ( !id ) return callback( '必须指定文档id', null );
    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var collection = client.collection( 'users' ),
                    i = 0, r1, errMsgArr = [];

                id = tools.isString( id ) ? [ id ] : id;

                for ( i; i < id.length; i++ ) {
                    console.log( id[i])
                    r1 = yield collection.deleteOne({ _id: objectId( id[i] ) });
                    if ( !r1.deletedCount ) {
                        errMsgArr.push( id[i] );
                    }
                }

                if ( !errMsgArr.length ) {
                    callback( null, {} );
                } else {
                    callback( errMsgArr.toString(), null );
                }

            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release( client );
        });
    });
};

module.exports = userDeleteService;