
/**
 * @method compress
 * @description 压缩图片
 *
 * @param {String} file 图片file对象
 * @param {Function} cbHandle 图片加载成功的回调
 *
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
        window[ "Compress" ] = _this;
    }
})(function() {

    var compress, guId = 0,
        canvas = {
            el: null,
            ctx: null
        };

    // 创建canvas
    canvas.create = function() {
        if ( canvas.el ) return;
        canvas.el = document.createElement( "canvas" );
        canvas.ctx = canvas.el.getContext( "2d" );
    };

    // 重置canvas
    canvas.rest = function() {
        var width = this.width,
            height = this.height;

        canvas.el.width = width;
        canvas.el.height = height;
        canvas.ctx.clearRect( 0, 0, width, height );
    };

    // 销毁remove
    canvas.remove = function() {
        canvas.el.width = canvas.el.height = 0;
    };

    // 设置draw
    canvas.draw = function() {
        var width = this.width,
            height = this.height,
            element = this.element;

        canvas.ctx.fillStyle = "#fff";
        canvas.ctx.fillRect( 0, 0, width, height );
        canvas.ctx.drawImage( element, 0, 0, width, height );
    };

    // 压缩最后一步
    canvas.toDataURL = function() {
        var base64,
            ratio = this.options.ratio,
            totalSize = this.totalSize;

        if ( totalSize / 1024 <= this.options.minimum || ratio === 1 ) {
            base64 = canvas.el.toDataURL( "image/jpeg" );
        } else {
            base64 = canvas.el.toDataURL( "image/jpeg", this.options.ratio );
        }

        console.log( "压缩前：" + ( totalSize / 1024 ) + "k" );
        console.log( "压缩后：" + ( base64.length / 1024 ) + "k" );
        console.log( "压缩率：" + ~~( 100 * ( totalSize - base64.length ) / totalSize ) + "%" );

        this.base64 = base64;
        this.options.success( base64 );
        this.destroy();
    };

    // 压缩尺寸
    canvas.whRatio = function() {
        var whRatio = this.width * this.height / this.options.sizePx;

        if ( whRatio > 1 ) {
            whRatio = Math.sqrt( whRatio );
            this.width /= whRatio;
            this.height /= whRatio;
        }
    };

    // 创建实例
    compress = function( element, options ) {

        options = options || {};
        guId++;

        this.element = element;
        this.totalSize = element.src.length;
        this.width = element.width;
        this.height = element.height;

        this.options = {
            ratio: options.ratio || 1,            // 压缩比 1
            sizePx: options.sizePx || 4000000,    // 最大尺寸 2000px * 2000px
            minimum: options.minimum || 100,      // 最小100k起压缩
            success: options.success || function() {}
        };

        this.init();
    };

    compress.prototype = {
        constructor: compress,
        init: function() {

            canvas.create();
            canvas.whRatio.call( this );
            canvas.rest.call( this );
            canvas.draw.call( this );
            canvas.toDataURL.call( this );
        },
        destroy: function() {
            var options = this.options, i;

            this.element = null;
            this.totalSize = null;
            this.width = null;
            this.height = null;
            this.base64 = null;

            for ( i in options ) delete options[i];
            options = null;
        }
    };

    return compress;
});