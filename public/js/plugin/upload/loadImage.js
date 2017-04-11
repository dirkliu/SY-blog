
/**
 * @method LoadImage
 * @description 检测图片加载状态
 *
 * @param {String} url 需要加载的图片地址
 * @param {Function} cbHandle 图片加载成功的回调
 *
 * @returnFunction
 *      @param {Element} image
 *      @param {Number} 完成状态 0失败, 1成功, 2缓存成功, -1获取元数据
 *      @param {Number} 递增id
 *
 *
 * @demo
 * loadImage.load( "url", function() {} );
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
        window[ "LoadImage" ] = _this;
    }
})(function() {

    var loadImage = {}, guId = 0;

    loadImage.load = function( url, cbHandle ) {
        var img, init, checkAttr, loopAttr, packHandle;

        packHandle = function( state ) {
            cbHandle( img, state, guId );
            clearInterval( loopAttr );
            img = null;
            packHandle = null;
        };

        checkAttr = function() {
            if ( img.width || img.height ) {
                clearInterval( loopAttr );
                cbHandle( img, -1, guId );
            }
        };

        // 初始化
        init = function() {

            if ( !url || typeof cbHandle !== "function" ) return;

            guId++;
            img = new Image();
            img.src = url;

            if ( img.complete ) {
                return packHandle( 2 );
            }

            img.onload = function() {
                packHandle( 1 );
            };

            img.onerror = function() {
                packHandle( 0 );
            };

            loopAttr = setInterval( checkAttr, 16 );
        };

        init();
    };

    return loadImage;
});