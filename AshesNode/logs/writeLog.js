
var fs = require( 'fs'),
    path = require( 'path'),
    oWrite = {},
    returnModule = {};

// 创建logs的文件类型
oWrite.config = {
    1: 'http',
    2: 'error'
};

// 普通转成string, 过滤undefined, function, NaN
oWrite.format = function( data ) {
    return JSON.stringify( data ) + ',\n';
};

/**
 * @method insert
 * @description 写入内容到文件
 *
 * @param {String} path 文件路径
 * @param {String} value 写入内容
 * @param {Boolean} isFlag 文件是否存在
 */
oWrite.insert = function( path, value, isFlag ) {
    var that = this;

    // 直接写入文件, 对于小文件写入
    if ( isFlag === false ) {
        return fs.writeFileSync( path, that.format( value ) );
    }

    fs.readFile( path, { encoding: 'utf-8' }, function ( err, data ) {
        if ( err ) {
            throw err;
        }
        var content = data + that.format( value );
        fs.writeFile( path, content, function ( err ) {
            if ( err ) throw err;
        });
    });
};

/**
 * @method oWrite.init
 * @description 初始化写入参数
 *
 * @param {Number} source 来源类型
 * @param {Object} o 要写入的参数
 *
 */
oWrite.init = function( o, source ) {

    source = source || 2;
    var that = this;
    var type = this.config[ source ];
    var date = tools.day.date();
    var filePath = path.resolve( __dirname, '../../' ) + '/logs/' + date + '-' + type + '.txt';

    fs.writeFile( filePath, that.format( o ), {
        flag: 'a'
    }, function( err ) {
        if ( err ) {
            return oWrite.init( err, 2 );
        }
    });

    // 检测文件是否存在
    // fs.exists( filePath, function( exists ) {
    //     if ( !exists ) {
    //         that.insert( filePath, o, exists );
    //     } else {
    //         that.insert( filePath, o );
    //     }
    // });
};

returnModule.init = oWrite.init.bind( oWrite );

module.exports = returnModule;
