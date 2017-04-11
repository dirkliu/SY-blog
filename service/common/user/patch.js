
var userPatchService,
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' );

/**
 * @method userPatchService
 * @description 局部更新文档
 * @param {Object} id 文档id
 * @param {Object} options 更新的字段
 * @param {Function} callback 查询成功的回调
 */
userPatchService = function( id, options, callback ) {

    if ( !id ) return callback( '必须指定文档id', null );
    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var collection = client.collection( 'users' ), r1;
                r1 = yield collection.updateOne( { _id: objectId( id ) }, { $set: options } );

                if ( r1.matchedCount ) {
                    callback( null, {} );
                } else {
                    throw '更新异常!';
                }
            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release( client );
        });
    });
};

module.exports = userPatchService;