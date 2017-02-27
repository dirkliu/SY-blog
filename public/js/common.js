/**
 * Created by Administrator on 2016/12/13.
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
        window[ "common" ] = _this;
    }
})(function() {

    var _toString = toString, isType, common = {};

    common.h = document.documentElement.clientHeight;
    common.w = document.documentElement.clientWidth;

    // 获取类型
    isType = function( o ) {
        return function( str ) {
            return _toString.call( str ) === "[object "+ o +"]";
        };
    };

    common.isArray = isType( "Array" );
    common.isObject = isType( "Object" );
    common.isFunction = isType( "Function" );
    common.isString = isType( "String" );
    common.isBoolean = isType( "Boolean" );
    common.isNumber = isType( "Number" );

    common.goto = function( url ) {
        if ( !url ) return;
        window.location.href = url;
    };

    // 弹出框, loading条
    common.popBox = function( options ) {

        var o = options || {}, bodyEl =  $( "body" ), fn,
            bgHtml = "", topHtml = "", contentHtml = "", isLong = false,
            domSYUILoading = null, btnHtml = "", allHtml = "";

        o.title = o.title || "";
        o.content = o.content || "";
        o.success = o.success || function() {};
        o.className = o.className || "";
        o.loading = o.loading || "";
        o.time = o.time || 1;
        o.close = ( common.isBoolean( o.close ) && o.close ) ? true : false;
        o.mask = ( common.isBoolean( o.mask ) && !o.mask ) ? false : true;

        fn = function( source ) {
            var popBox = $( ".SYUI-popBox" ),
                mask = $( ".SYUI-mask" );

            source = source || false;
            popBox.addClass( "SYUI-popBox-out" );
            mask.remove();
            !source && common.isFunction( o.success ) && o.success();

            setTimeout(function() {
                popBox.remove();
            }, 230);
        };

        // 判断
        !$( ".SYUI-mask" ).length && o.mask && ( bgHtml = "<div class='SYUI-mask'></div>" );

        o.btn = ( common.isBoolean( o.btn ) && !o.btn ) ? false : ( o.btn || "确定" );

        if ( common.isBoolean( o.time ) ) isLong = true;

        o.title && ( topHtml = ""+
            "<div class='top'>" +
                "<h2>" + o.title + "</h2>" +
                "<span class='events close'></span>" +
            "</div>" );

        o.content && ( contentHtml = "" +
            "<div class='content'>" +
                "<div class='subtext'>" + o.content + "</div>" +
            "</div>" );

        o.btn && ( btnHtml = "" +
            "<div class='btn'>" +
                "<span class='events yes'>"+ o.btn +"</span>" +
            "</div>" );

        // loading条
        if ( !o.title && !o.content ) {
            contentHtml = o.loading;
            o.className = "SYUI-loading";
            btnHtml = "";
        }

        // 组合
        allHtml = "" +
            bgHtml +
            "<div class='SYUI-popBox SYUI-popBox-In "+ o.className +"'>" +
                topHtml +
                contentHtml +
                btnHtml +
            "</div>";

        if ( !o.title && !o.content && !o.loading ) return;

        // 关闭
        if ( o.close ) return fn();

        // loading
        if ( !o.title && !o.content && o.loading ) {

            domSYUILoading = $( ".SYUI-loading" );
            if ( !domSYUILoading.length ) {
                bodyEl.append( allHtml );
            } else {
                domSYUILoading.html( contentHtml );
            }

            if ( !isLong && o.time ) {
                setTimeout(function() {
                    fn();
                }, o.time * 1000 );
            }
            return;
        }

        // 事件绑定
        bodyEl
            .append( allHtml )
            .off( "tap", ".SYUI-popBox .events" )
            .on( "tap", ".SYUI-popBox .events", function ( e ) {

                var evt = e.target, source = false;
                if ( evt.classList.contains( "close" ) ) source = true;

                fn( source );
                e.preventDefault();
            });
    };

    // 关闭弹出层和loading
    common.popBoxHide = function() {
        var bodyEl =  $( "body" ),
            popBox = $( ".SYUI-popBox" ),
            mask = $( ".SYUI-mask" );

        mask.remove();
        popBox.remove();
        bodyEl.off( "tap", ".SYUI-popBox .events" );
    };

    /**
     * @method fetch
     * @description 基于zepto封装项目网络层
     *
     * @param {String} url 接口地址
     * @param {Object} data 传递的参数
     * @param {Function} callBack 成功的回调
     * @param {Function} errBack 网络错误的回调
     * @param {Object} options 格外的参数设置
     *
     * options = {
     *      {String} type http请求方法,可选[ post, delete, put, get, patch.... ],
     *      {String} text 用于提示信息的文字
     *      {Boolean} isHide 请求成功后是否关闭loading条, 默认true
     *      {Boolean} isLoading 是否开启loading条, 默认true
     * }
     */
    common.fetch = function( url, data, callBack, errBack, options ) {

        url = url || "";
        data = data || {};
        callBack = callBack || function() {};
        errBack = errBack || function() {};

        options = options || {};
        options.type = options.type || "get";
        options.text = options.text || "正在操作...";
        options.isHide = ( options.isHide === false ) ? false : true;
        options.isLoading = ( options.isLoading === false ) ? false : true;

        if ( !url ) return;
        if ( !common.isFunction( callBack ) ) return;
        if ( !common.isFunction( errBack ) ) return;

        options.isLoading && common.popBox({
            loading: options.text,
            mask: false,
            time: true
        });

        $.ajax({
            url: url,
            data: data,
            type: options.type,
            success: function( data ) {
                options.isHide && options.isLoading && common.popBoxHide();

                data = data || { code: -1, msg: '数据错误!' };
                data = common.isString( data ) ? JSON.parse( data ) : data;

                if ( data.code != 0 ) {
                    callBack( false, data );
                    return common.popBox({
                        loading: data.msg,
                        time: 1
                    });
                }

                callBack( data.data );
            },
            error: function () {
                options.isLoading && common.popBoxHide();
                common.popBox({
                    title: "十月提示",
                    content: "网络错误, 是否重试?",
                    mask: true,
                    success: function( source ) {
                        if ( source ) return;
                        errBack();
                    }
                });
            }
        });
    };

    // 过滤器
    common.filter = function( data, key, value ) {
        if ( !common.isArray( data ) || typeof value === "undefined" ) return;
        var i = 0, j = data.length, o;

        while( i < j ) {
            if ( data[ i ][ key ] === value ) {
                o = data[ i ];
                break;
            }
            i++;
        }
        return o;
    };

    return common;

});