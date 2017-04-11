
/**
 * @method ReaderFile
 * @description 读取files到base64
 *
 * @param {String} file 图片file对象
 * @param {Function} cbHandle 图片加载成功的回调
 *
 * @demo
 * new ReaderFile( "file", {
 *      start: function() {},
 *      progress: function() {},
 *      success: function() {},
 *      error: function() {}
 * })
 */

(function( o ) {
    var _this = o();
    if ( typeof exports === "object" ) {
        module.exports = _this;
    } else if ( typeof define === "function" && define.amd ) {
        define( [], function() {
            return _this;
        });
    } else {
        window[ "ReaderFile" ] = _this;
    }
})(function() {

    var readerFile, guId = 0,
        ERRORTEXT = {
            1: "file不是有效的文件对象",
            2: "读取文件失败"
        };

    readerFile = function( file, options ) {
        options = options || {};
        guId++;
        this.file = file;
        this.options = {
            start       : options.start,        // 读取开始
            progress    : options.progress,     // 读取进度
            success     : options.success,      // 读取成功
            error       : options.error         // 读取失败
        };
        this.init();
    };

    readerFile.prototype = {
        constructor: readerFile,
        oReader: null,
        init: function() {
            if ( typeof this.file !== "object" ) {
                this.options.error( ERRORTEXT[1] );
                return this.destroy();
            }
            this.options.start( null );
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this,
                file = self.file;

            self.oReader = new FileReader();

            self.oReader.onloadstart = function( e ) {
                self.options.start({
                    timeStamp: e.timeStamp,
                    total: e.total
                });
            };

            self.oReader.onprogress = function( e ) {
                var speed = e.loaded / e.total * 100 | 0;
                self.options.progress( speed );
            };

            self.oReader.onload = function( e ) {
                var base64Str = e.target.result;
                self.options.success( base64Str );
                self.destroy();
            };

            self.oReader.onerror = function() {
                self.options.error( ERRORTEXT[2] );
                self.destroy();
            };

            self.oReader.readAsDataURL( file );
        },
        destroy: function() {
            var options = this.options;
            this.file = null;
            this.oReader = null;
            for ( var i in options ) delete options[i];
            options = null;
        }
    };

    return readerFile;
});