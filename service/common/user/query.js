
var queryUser,
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' );

/**
 * @method queryUser
 * @description 读取用户列表接口
 * @param {String} options 选项{ id, *** }
 * @param {Function} callback 查询成功的回调
 */
queryUser = function( options, callback ) {

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var collection = client.collection( 'users' ),
                    docs = {}, oQuery, oSort, pageSize, page;

                options = options || {};
                oSort = options.sort || {};
                oQuery = options.query || {};                   // 查询参数
                page = ( options.page | 0 ) || 1;               // 分页
                pageSize = ( options.pageSize | 0 ) || 10;      // 每页条数

                // 如果有_id 则转换下
                if ( oQuery._id ) {
                    oQuery._id = objectId( oQuery._id );
                }

                docs.total = yield collection.find( oQuery ).count();
                docs.page = page;
                docs.pageSize = pageSize;

                docs.list = yield collection.find( oQuery )
                    .sort( oSort )
                    .skip( ( page - 1 ) * pageSize )
                    .limit( pageSize )
                    .toArray();

                callback( null, docs );
            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release( client );
        });
    });
};

module.exports = queryUser;