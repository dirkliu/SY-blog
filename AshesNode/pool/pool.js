/**
 * Created by 00013712 on 2017/1/4.
 *
 * @method poolModule
 * @description 连接池管理对象, 固定开启N个连接数, 解决每次连接, 关闭的缓慢
 *
 */

var poolModule = (function() {

    var Pool,
        connect = require( './connectMongo' ),
        queue = require( './queue' );

    /*
        @param {Object} o 配置信息
            @param {Object} connect_options [ dbName, hostName, port ]
            @param {Number} max 设置连接数个数
            @param {Number} idleTimeoutMills 连接超时, 自动归还连接池
     */
    Pool = function( o ) {
        o = o || {};
        this.connect_options = o.connect_options;
        this.max = o.max || 10;
        this.idleTimeoutMills = o.idleTimeoutMills || 30000;
        this.init();
    };

    Pool.prototype.constructor = Pool;

    Pool.prototype.init = function() {
        this.addQueue();
        return this;
    };

    // 根据max生成连接数, 放入连接池
    Pool.prototype.addQueue = function() {
        var i = 0, j = this.max;
        for ( ; i < j; i++ ) {
            connect( this.connect_options, function( err, db ) {

                // 加入队列, 添加标识, 也许要关闭单独的数据连接
                !err && queue.add({
                    guId: ( + new Date() ),
                    state: true,
                    err: err,
                    collection: db,
                    db: this
                });
            });
        }
        return this;
    };

    // 获取一个连接, 使用
    Pool.prototype.accquire = function( fn ) {
        var o = this.connectDB = queue.get(),
            err = o.err,
            collection = o.collection;

        if ( typeof fn !== 'function' ) return;

        // 如果状态无效, 设置不可用
        if ( o.state === false ) {
            err = { code: -9998, msg: '连接不可用' };
            collection = null;
        }

        // 连接池个数为空, 连接超时, 是否把当前请求加入未完成队列?
        if ( typeof o.state === 'undefined' ) {
            err = { code: -9999, msg: '连接池为空' };
            collection = null;
        }

        fn.call( o.db, err || {}, collection );
        return this;
    };

    // 获取所有连接数
    Pool.prototype.getAllConnect = function() {
        return queue.getAll();
    };

    // 关闭所有连接
    Pool.prototype.close = function( id, fn ) {
        var list = this.getAllConnect(), callBack;
        if ( typeof id === "function" ) {
            callBack = fn;
            id = null;
        }

        list.forEach(function( item ) {
            item.db.close();
            item.state = false;
        });

        ( typeof callBack === "function" ) && callBack();
        return this;
    };

    // 返回连接池, 是否要对无效的连接, 关闭？
    Pool.prototype.release = function( db ) {
        queue.add({
            guId: ( + new Date() ),
            state: true,
            err: null,
            collection: db,
            db: this.connectDB.db
        });
        return this;
    };

    return {
        Pool: function( o ) {
            return new Pool( o );
        }
    }
})();

module.exports = poolModule;

/*
@用法

// 连接方式一
var AshesNode = require( '../AshesNode/init' );     // 引入库
var pool = AshesNode.pool();                        // 获取连接池对象

// 连接方式二
var pool = Pool( o );


// 拿取连接池
pool.accquire(function( err, client ) {

    // 连接池为空, 或者当前连接不可用
    if ( err.code >= -9999 ) {
        return callback( err, null );
    }
    client.collection( 'posts', function( err, collection ) {
        // collection操作数据库
        pool.release( client );     //归还到连接池
    });
});

pool.close();       // 关闭所有连接池

*/
