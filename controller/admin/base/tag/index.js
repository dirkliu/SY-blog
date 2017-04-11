
var controller = {},
    model = require( './model' );

// 提取数据
controller.extractData = function( body ) {
    return {
        tagName: body.tagName,
        createTime: tools.day.timeSeconds()
    };
};

controller[ 'render' ] = function( res, data ) {
    return res.render( 'admin/base/tag', {
        title: '-标签管理',
        data: data
    });
};

controller[ 'init' ] = function( req, res ) {

    var query = req.query,
        options = {
            query: {},
            sort: {
                createTime: -1
            },
            pageSize: 50
        },
        returnData = {
            list: []
        };

    model.query( options, function( err, data ) {
        if ( err ) {
            returnData.errorMsg = err;
        } else {
            returnData = data;
        }
        return controller[ 'render' ]( res, returnData );
    });
};

// 新增
controller[ 'post' ] = function( req, res ) {
    var body = req.body,
        options = controller.extractData( body );

    model.add( options, function( err, data ) {
        var o = err ? [ -1, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, o ) );
    });
};

// 删除
controller[ 'delete' ] = function( req, res ) {
    var id = req.params.ids;

    if ( !id ) return res.json( returnFactory( -10, '请指定文档id' ) );

    model.delete( id, function( err, data ) {
        var o = err ? [ -1, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, o ) );
    });
};

// 更新
controller[ 'patch' ] = function( req, res ) {
    var body = req.body,
        id = req.params.ids,
        options = {};

    if ( !id ) return res.json( returnFactory( -10, '无更新信息' ) );

    if ( body.tagName ) {
        options.tagName = body.tagName;
    }

    return model.patch( id, options, function( err, data ) {
        var o = err ? [ -1, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, o ) );
    });
};

module.exports = controller;









