
var tag = {},
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' ),
    fieldValidate = tools.require( 'service/common/validate/validateModel' ),
    dbModel = require( './dbModel' );

/**
 * @method query
 * @description 读取tag信息
 * @param {String} options 选项{ id }
 * @param {Function} callback 查询成功的回调
 */
tag.query = function( options, callback ) {

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var collection = client.collection( 'tag' ),
                    docs = {}, oQuery, oSort, pageSize, page;

                options = options || {};
                oSort = options.sort || {};
                oQuery = options.query || {};                   // 查询参数
                page = ( options.page | 0 ) || 1;               // 分页
                pageSize = ( options.pageSize | 0 ) || 10;      // 每页条数

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

                //console.log( 'docs', docs );
                callback( null, docs );
            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release( client );
        });
    });
};

/**
 * @method save
 * @description 保存标签接口
 * @param {Object} options 要保存的字段
 * @param {Function} callback 查询成功的回调
 */
tag.save = function( options, callback ) {

    // 入库的时候验证字段类型, 设置默认值
    var validate = fieldValidate.category( options, dbModel );
    if ( validate.code < 0 ) return callback( validate.msg, null );

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var doc,
                    collection = client.collection( 'tag' );

                doc = yield collection.insertOne( options );
                if ( !doc.insertedCount ) throw '插入失败';
                callback( null, {} );
            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release( client );
        });
    });
};

/**
 * @method patch
 * @description 局部更新字段, 关联集合有[ 列表, 详细 ]
 * @param {String} id 要更新的id
 * @param {Object} options 需要更新的内容
 * @param {Function} callback 回调
 */
tag.patch = function( id, options, callback ) {

    if ( !id || !options ) return callback( '必须指定id和字段', null );

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function *() {
            try {

                var col, r1 = '';

                col = client.collection( 'tag' );
                r1 = yield col.updateOne( { _id: objectId( id ) }, { $set: options } );

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

/**
 * @method delete
 * @description 删除指定的标签, 支持批量删除
 * @param {String} id 要删除的id
 * @param {Function} callback 查询成功的回调
 */
tag.delete = function( id, callback ) {

    if ( !id ) return callback( '必须指定文档id', null );
    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {
            try {

                var r1, i = 0, errMsgArr = [],
                    arrId = tools.isString( id ) ? [ id ] : id,
                    collection = client.collection( 'tag' );

                for ( ; i < arrId.length; i++ ) {
                    r1 = yield collection.deleteOne({ _id: objectId( arrId[i] ) });
                    if ( !r1.deletedCount ) {
                        errMsgArr.push( arrId[i] );
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

module.exports = tag;