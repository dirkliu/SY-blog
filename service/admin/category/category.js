
var category = {},
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' ),
    fieldValidate = tools.require( 'service/common/validate/validateModel' ),
    dbModel = require( './dbModel' );

/**
 * @method query
 * @description 读取分类信息接口
 * @param {String} id parentId字段
 * @param {Function} callback 查询成功的回调
 */
category.query = function( id, callback ) {

    // 打开一个连接池
    pool.accquire(function( err, client ) {

        // 连接池为空
        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {
            try {
                var collection = client.collection( 'category' ),
                    docs, i = 0, signDocs, _id;

                id = id || '0';
                docs = yield collection.find({ 'parentId': id }).toArray();

                if ( docs ) {
                    for ( i; i < docs.length; i++ ) {
                        _id = docs[ i ][ '_id' ];
                        signDocs = yield collection.find({ 'parentId': _id.toString() }).toArray();
                        docs[ i ][ 'son' ] = signDocs;
                    }
                }

                callback( null, docs );
            } catch ( err ) {
                callback( err, null );
            }

            // 释放连接池
            pool.release( client );
        });
    });
};

/**
 * @method save
 * @description 读取分类信息接口
 * @param {Object} options 要保存的字段
 * @param {Function} callback 查询成功的回调
 */
category.save = function( options, callback ) {

    // 入库的时候验证字段类型, 设置默认值
    var validate = fieldValidate.category( options, dbModel.category );
    if ( validate.code < 0 ) return callback( validate, null );

    pool.accquire(function( err, client ) {
        if ( err.code <= -9998 ) return callback( err, null );

        co(function*() {
            try {
                var collection = client.collection( 'category' );

                // 修改
                if ( options.id ) {
                    var oFind = yield collection.findOne({ _id: objectId( options.id ) });
                    if ( oFind ) {
                        options.parentId = oFind.parentId;
                        var idd = options.id;
                        delete options.id;
                        var update = yield collection.updateOne({
                            _id: objectId( idd )
                        }, { $set: options }, { upsert: true });

                        if ( update.result.ok !== 1 ) {
                            callback( -1, null );
                        } else {
                            callback( null, {} );
                        }
                    } else {
                        callback( -1, null );
                    }
                }

                var r = yield collection.insertOne( options );
                callback( null, {} );
                console.log( "*****************************", r.insertedCount, +new Date() )

            } catch ( err ) {
                callback( err, null );
            }
            pool.release( client );
        });
    });
};

/**
 * @method save
 * @description 读取分类信息接口
 * @param {String} id 要删除的id
 * @param {Function} callback 查询成功的回调
 */
category.delete = function( id, callback ) {

    pool.accquire(function( err, client ) {
        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {
            try {
                var collection, oFind, oDelete, oId;

                collection = client.collection( 'category' );
                oFind = yield collection.findOne({ _id: objectId( id ) });
                if ( !oFind ) return callback( -1, null );

                oDelete = yield collection.deleteOne({ _id: objectId( id ) });
                if ( !oDelete.deletedCount ) return callback( -1, null );

                var docs = yield collection.findOne({ parentId: oFind.parentId });
                if ( docs ) return callback( null, {} );

                oId = yield collection.deleteOne({ _id: objectId( oFind.parentId ) });
                if ( oId.deletedCount ) {
                    callback( null, {} );
                } else {
                    callback( -1, null );
                }
            } catch ( err ) {
                callback( err, null );
            }
            pool.release( client );
        });
    });
};

module.exports = category;