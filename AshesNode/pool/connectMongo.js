/**
 * Created by 00013712 on 2017/1/4.
 *
 * @method ConnectMongo
 * @description 连接数据库
 *
 * @param {Object} o 配置信息
 *      @param {String} dbName 数据库名
 *      @param {String} hostName 地址
 *      @param {Number} port 端口号
 *      @param {Object} server_options 服务器配置信息
 *      @param {Object} db_options 连接db的配置信息
 *
 * @param {Function} callBack 连接成功的回调
 */

var ConnectMongo,
    Db = require( 'mongodb' ).Db,
    Server = require( 'mongodb' ).Server;

ConnectMongo = function( o, callBack ) {
    o = o || {};
    this.dbName             = o.dbName;
    this.hostName           = o.hostName || 'localhost';
    this.port               = o.port || 27017;
    this.server_options     = o.server_options || {};
    this.db_options         = o.db_options || {};
    this.callBack           = callBack || function() {};
    this.init();
};

ConnectMongo.prototype.constructor = ConnectMongo;

ConnectMongo.prototype.init = function() {

    var mongoServer, db, _this = this;

    if ( !this.dbName ) return;
    mongoServer = new Server( this.hostName, this.port, this.server_options );
    db = new Db( this.dbName, mongoServer, this.db_options );

    db.open(function( err, collection ) {
        if ( err ) return _this.callBack( err, null );

        // 引入db实例, 方便在队列关闭数据库连接
        _this.callBack.call( db, null, collection );
    });
};

module.exports = function( o, fn ) {
    return new ConnectMongo( o, fn );
};
