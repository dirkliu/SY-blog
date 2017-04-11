
var article = {},
    pool = APool(),
    co = require( 'co' ),
    objectId = require( 'objectid' ),
    fieldValidate = tools.require( 'service/common/validate/validateModel' ),
    articleDBModel = require( './articleDBModel' );

/**
 * @method query
 * @description 读取文章列表接口
 * @param {String} options 选项{ id, categoryId }
 * @param {Function} callback 查询成功的回调
 */
article.query = function( options, callback ) {

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var collection = client.collection( 'article' ),
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
 * @description 保存文章接口
 * @param {Object} options 要保存的字段
 * @param {Function} callback 查询成功的回调
 */
article.save = function( options, callback ) {

    // 入库的时候验证字段类型, 设置默认值
    var validate = fieldValidate.category( options, articleDBModel );
    if ( validate.code < 0 ) return callback( validate, null );

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {

            try {
                var doc, docDetail,
                    oDetail = {
                        content: options.content
                    },
                    collection = client.collection( 'article' ),
                    collectionDetail = client.collection( 'article_detail' );

                delete options.content;
                doc = yield collection.insertOne( options );
                if ( !doc.insertedCount ) throw '插入失败';

                oDetail._id = objectId( doc.ops[0]._id );
                docDetail = yield collectionDetail.insertOne( oDetail );
                if ( !docDetail.insertedCount ) throw '插入失败';

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
article.patch = function( id, options, callback ) {

    if ( !id || !options ) return callback( '必须指定id和字段', null );

    // 提取detail集合数据, 过滤空字符
    var extractDetail = function( options ) {
        var o = {
            content: options.content
        };
        return tools.filterEmpty( o );
    };

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function *() {
            try {

                var col, col_detail, r1 = '', r2 = '',
                    extractData = extractDetail( options );

                col = client.collection( 'article' );
                r1 = yield col.updateOne( { _id: objectId( id ) }, { $set: options } );

                // 有修改, 关联detail集合
                if ( tools.isEmptyValue( extractData ) ) {
                    extractDetail = null;
                    col_detail = client.collection( 'article_detail' );
                    r2 = yield col_detail.updateOne( { _id: objectId( id ) }, { $set: extractData } );
                }

                if ( r1.matchedCount || r2.matchedCount ) {
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
 * @description 删除指定的文档
 * @param {String} id 要删除的id
 * @param {Function} callback 查询成功的回调
 */
article.delete = function( id, callback ) {

    if ( !id ) return callback( '必须指定文档id', null );
    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return callback( err, null );
        co(function*() {
            try {

                var r1, r2, i = 0, errMsgArr = [],
                    arrId = tools.isString( id ) ? [ id ] : id,
                    collectionDetail = client.collection( 'article_detail' ),
                    collection = client.collection( 'article' );

                for ( ; i < arrId.length; i++ ) {
                    r1 = yield collection.deleteOne({ _id: objectId( arrId[i] ) });
                    r2 = yield collectionDetail.deleteOne({ _id: objectId( arrId[i] ) });
                    console.log( !r1.deletedCount , !r2.deletedCount )
                    if ( !r1.deletedCount || !r2.deletedCount ) {
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

/**
 * @method queryDetail
 * @description 查询文章详细页信息
 * @param {String} id 文档id
 * @param {Function} callback 回调
 */
article.queryDetail = function( id, callback ) {

    if ( !id ) return callback( '必须指定文档id', null );
    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return  callback( err, null );
        co(function *() {
            try {

                var col, result;

                col = client.collection( "article_detail" );
                result = yield col.findOne({ _id: objectId( id ) });

                if ( result._id ) {
                    callback( null, result );
                } else {
                    throw '查询异常';
                }

            } catch ( err ) {
                callback( err.toString(), null );
            }

            pool.release();
        })
    })
};

module.exports = article;