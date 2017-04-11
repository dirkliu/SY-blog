
var controller = {},
    level = {
        1: "首页",
        2: "栏目页",
        3: "列表页"
    },
    model = require( './model' );

controller[ 'render' ] = function( res, data ) {
    return res.render( 'admin/base/recommend', {
        title: '-推荐管理',
        data: data,
        level: level
    });
};

controller[ 'init' ] = function( req, res ) {

    var query = req.query,
        options = {
            query: {
                recommendLevel: query.recommendLevel | 0
            },
            sort: {
                createTime: -1
            },
            pageSize: 30
        },
        returnData = {
            list: []
        };

    // <= 0 查询全部推荐
    if ( options.query.recommendLevel <= 0 ) {
        options.query.recommendLevel = { $gt: 0 };
    }

    model.query( options, function( err, data ) {
        if ( err ) {
            returnData.errorMsg = err;
        } else {
            returnData = data;
        }
        return controller[ 'render' ]( res, returnData );
    });
};

// 更新
controller[ 'patch' ] = function( req, res ) {

    var body = req.body,
        id = req.params.ids,
        options = {
            recommendLevel: body.recommendLevel | 0
        };

    if ( !id ) return res.json( returnFactory( -1, '指定取消推荐的id' ) );

    model.patch( id, options, function( err, data ) {
        var o = err ? [ -1, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, o ) );
    });
};

module.exports = controller;









