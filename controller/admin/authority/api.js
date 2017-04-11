
var controller = {}, helper = {},

    // 要过滤的接口
    routeFilter = {
        '/admin/authority/api': true,
        '/admin/authority/api/delete/:path': true,
        '/admin/authority/api/patch/:path': true,
        '/admin/login': true,
        '/': true,
        '/admin': true,
        '/reg': true,
        '/cookie/add': true
    },
    configRoute = tools.require( 'config/route' );

// 转换path发送
helper.toEncode = function( str ) {
    return str.replace( /\/|:/g, "" );
};

// 返回索引值
helper.filterIndex = function( key, value ) {
    var indexNum = 0;
    configRoute.forEach(function( item, index ) {
        if ( helper.toEncode( item[ key ] ) === value ) return indexNum = index;
    });
    return indexNum;
};

// 删除数组的value
helper.delete = function( key, value ) {
    var index = -1;

    index = helper.filterIndex( key, value );
    configRoute.splice( index, 1 );
    return index;
};


helper.update = function( key, value, options ) {
    var index = -1, i, currentRoute;

    index = helper.filterIndex( key, value );
    currentRoute = configRoute[ index ];
    for ( i in options ) currentRoute[i] = options[i];

    return index;
};

controller[ 'init' ] = function( req, res ) {
    return res.render( 'admin/authority/api', {
        title: '-接口管理',
        data: configRoute,
        routeFilter: routeFilter
    });
};

controller[ 'delete' ] = function( req, res ) {
    var params = req.params, index, arr;

    index = helper.delete( 'route', params.path );
    arr = index > -1 ? [ 0, null ] : [ -1, '删除失败' ];
    res.json( returnFactory.apply( null, arr ) );
};

controller[ 'patch' ] = function( req, res ) {
    var params = req.params,
        body = req.body,
        index, arr;

    index = helper.update( 'route', params.path, {
        authority: body.authority | 0
    });

    arr = index > -1 ? [ 0, null ] : [ -1, '更新失败' ];
    res.json( returnFactory.apply( null, arr ) );
};

module.exports = controller;









