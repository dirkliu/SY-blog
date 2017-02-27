
/**
    @method AshesNode
    @description 封装一个精简的库, 用于配置, 验证
 */
var AshesNode = (function() {

    var init, route, model, pool, appExpress, routeNew = null,
        routeController = require( './controller/route' ),
        modelController = require( './controller/model' ),
        poolController = require( './pool/pool' );

    init = function( exp ) {
        appExpress = exp || {};
        return this;
    };

    route = function( opt ) {
        if ( routeNew ) return;
        routeNew = new routeController( opt, appExpress );
        return this;
    };

    model = function() {
        return modelController();
    };

    // 获取pool对象
    pool = function( o ) {
        return poolController.Pool( o );
    };

    return {
        init: init,
        route: route,
        model: model,
        pool: pool
    }
})();

// 暴露连接池为全局对象
global.APool = AshesNode.pool;
module.exports = AshesNode;