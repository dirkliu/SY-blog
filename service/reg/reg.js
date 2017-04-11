
var regService = {},
    pool = APool(),
    fieldValidate = tools.require( 'service/common/validate/validateModel' ),
    regDBModel = require( './regDBModel'),
    co = require( 'co' );

regService.checkUser = function( userName, cbHandle ) {

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return cbHandle( err, null );
        co(function *() {

            try {

                var doc, collectionUser = client.collection( 'users' );
                doc = yield collectionUser.findOne({ name: userName });

                if ( doc ) throw '用户名已存在!';
                cbHandle( null, {} );

            } catch ( err ) {
                cbHandle({ code: -1, msg: err }, null );
            }

            pool.release( client );
        });
    });
};

regService.register = function( options, cbHandle ) {

    // 验证字段类型
    var validate = fieldValidate.category( options, regDBModel );
    if ( validate.code < 0 ) return cbHandle( validate.msg, null );

    pool.accquire(function( err, client ) {

        if ( err.code <= -9998 ) return cbHandle( err, null );
        co(function *() {

            try {

                var doc, collectionUser = client.collection( 'users' );
                doc = yield collectionUser.insertOne( options );

                //console.log( '插入', doc.insertedCount, doc.ops, doc.result );
                if ( !doc.insertedCount ) throw '插入失败';
                cbHandle( null, doc.ops[0] );

            } catch ( err ) {
                cbHandle( err, null );
            }

            pool.release( client );
        });
    });
};

module.exports = regService;