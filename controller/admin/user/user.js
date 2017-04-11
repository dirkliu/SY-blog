
var controller = {},
    helper = {},
    userQueryModel = require( './userQueryModel' );


helper.returnJson = function( err, data, res ) {
    var returnArr = err ? [ -1, err ] : [ 0, data ];
    return res.json( returnFactory.apply( null, returnArr ) );
};

// 删除用户
controller[ 'delete' ] = function( req, res ) {

    var params = req.params;

    userQueryModel.delete( params.ids, function( err, data ) {
        return helper.returnJson( err, data, res );
    });
};

// 局部更新
controller[ 'patch' ] = function( req, res ) {
    var body = req.body, i,
        id = req.params.ids, isPass,
        options = {};

    // 提取需要更新的字段
    for ( i in body ) {
        if ( body[i] === 'null' || body[i] === 'undefined' || !body[i] ) continue;
        isPass = true;
        options[i] = body[i];
    }

    if ( !id || !isPass ) return res.json( returnFactory( -10, '无更新信息' ) );

    // 设置权限
    if ( options.role ) {
        return userQueryModel.patchRole( id, options, function( err, data ) {
            return helper.returnJson( err, data, res );
        });
    }

    // 冻结用户
    if ( options.isFreeze ) {
        return userQueryModel.patchFreeze( id, options, function( err, data ) {
            return helper.returnJson( err, data, res );
        });
    }

    /*userQueryModel.patch( id, options, function( err, data ) {
        var returnArr;

        returnArr = err ? [ -1, err ] : [ 0, null ];

        return res.json( returnFactory.apply( null, returnArr ) );
    });*/
};

module.exports = controller;









