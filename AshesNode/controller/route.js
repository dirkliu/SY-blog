
var tools = require( '../helper/tools' ),
    writeLog = require( '../logs/generate' ),
    rbac = require( '../../logic/rbac/initialize' ),
    token = require( '../../logic/token/initialize' ),
    path = require( 'path' ),
    requireFile, filterNoFunction, extendMiddleware;

// 加载控制器文件
requireFile = function( path ) {
    var Action = null;
    try {
        Action = require( path );
    } catch ( err ) {
        return writeLog.error({
            code: -70001,
            desc: '解析路径:' + path
        });
    }
    return Action;
};

// 过滤出非函数
filterNoFunction = function( arr ) {
    arr.forEach(function( item, index ) {
        if ( !tools.isFunction( item ) ) {
            arr.splice( index, 1 );
        }
    });
    return arr;
};

// 自定义中间件处理
extendMiddleware = function( o ) {
    var actionFn = null, controller, middleware;

    if ( !tools.isObject( o.middleware ) ) return actionFn;
    if ( !o.middleware.action ) return actionFn;

    middleware = o.middleware;
    controller = o.controller;

    // 如果主controller和自定义中间件controller一致, 则直接取action
    // 否则require加载controller
    if ( controller === middleware.controller ) {
        actionFn = o.action[ middleware.action ];
    } else {
        middleware.Action = requireFile( o.path + middleware.controller );
        if ( middleware.Action ) {
            actionFn = middleware.Action[ middleware.action ];
        }
    }

    middleware.Action = null;
    return actionFn;
};

/**
 * @method route
 * @description 封装路由控制器, 执行一系列中间件注册
 *
 * @param {Object} options 用户路由的配置
 * @param {Function} appExpress express实例
 */
module.exports = function( options, appExpress ) {

    if ( !tools.isArray( options ) ) {
        return writeLog.error({
            code: -70000,
            desc: 'config.route'
        });
    }

    options.forEach(function( o ) {
        var method = o.method,
            route = o.route,
            authority = o.authority,
            oExtendMiddleware = o.extendMiddleware,
            Action, controllerPath, middlewareFn,

            // 中间件注册队列
            handleQueue = [ writeLog.request ],
            actionName = o.action || 'init';

        method = tools.isString( method ) ? [ method ] : method;
        controllerPath = path.resolve( __dirname, '../../controller' );

        // 如果权限码存在, 则concat
        if ( authority ) {
            handleQueue = handleQueue.concat( token.check, rbac( authority ) );
        }

        Action = requireFile( controllerPath + o.controller );
        if ( !Action ) return;

        // 处理自定义中间件
        if ( oExtendMiddleware ) {
            middlewareFn = extendMiddleware({
                path: controllerPath,
                controller: o.controller,
                middleware: oExtendMiddleware,
                action: Action
            });
            middlewareFn && handleQueue.push( middlewareFn );
        }

        handleQueue.push( Action[ actionName ] );

        // 正式注册路由
        method.forEach(function( value ) {
            appExpress[ value ]( route, filterNoFunction( handleQueue ) );
        });

        Action = null;
    });
};