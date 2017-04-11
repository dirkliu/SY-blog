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

    var _toString = Object.prototype.toString, isType,
        common = {
            h: document.documentElement.clientHeight,
            w: document.documentElement.clientWidth,
            on: function( element, type, fn ) {
                element.addEventListener( type, fn, false );
            },
            off: function( element, type, fn ) {
                element.removeEventListener( type, fn );
            },
            id: function( id ) {
                return document.querySelector( id );
            }
        };

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

    // 判断是否为空 仅限于{ Array, Object, String }类型
    common.isEmptyValue = function( params ) {
        params = params || {};
        return Object.keys( params ).length;
    };

    common.getRequestParam = function( t, o ) {
        var e = new RegExp("(^|#|&)" + o + "=([^&]*)(&|$)"), n = t.substr(1).match(e);
        return null != n ? unescape(n[2]) : null
    };

    common.g = function( t ) {
        return common.getRequestParam( window.location.search, t );
    };

    // 跳转地址
    common.goto = function( url ) {
        if ( !url ) return window.location.reload();
        window.location.href = url;
    };

    // 解决弹出框滚动穿透
    common.ModalHelper = (function( cls ) {
        var scrollTop;
        return {
            afterOpen: () => {
                scrollTop = document.scrollingElement.scrollTop;
                document.body.classList.add( cls );
                document.body.style.top = -scrollTop + 'px';
            },
            beforeClose: () => {
                document.body.classList.remove( cls );
                document.scrollingElement.scrollTop = scrollTop;
            }
        };
    })( 'modal-open' );

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

            popBox.addClass( "SYUI-popBox-out" );
            mask.remove();
            common.isFunction( o.success ) && o.success( source );
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
        if ( o.close ) return fn( "auto" );

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
                    fn( "loading" );
                }, o.time * 1000 );
            }
            return;
        }

        // 事件绑定
        bodyEl
            .append( allHtml )
            .off( "tap", ".SYUI-popBox .events" )
            .on( "tap", ".SYUI-popBox .events", function ( e ) {

                var evt = e.target, source = null;
                if ( evt.classList.contains( "close" ) ) source = "close";
                if ( evt.classList.contains( "yes" ) ) source = "yes";

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
     *      {String} type http请求方法,可选[ POST, DELETE, PUT, GET, PATCH.... ],
     *      {String} text 用于提示信息的文字
     *      {Boolean} isHide 请求成功后是否关闭loading条, 默认true
     *      {Boolean} isLoading 是否开启loading条, 默认true
     *      {Object} headers 添加http请求头
     * }
     */
    common.fetch = function( url, data, callBack, errBack, options ) {

        var oAjaxParams;
        url = url || "";
        data = data || {};
        callBack = callBack || function() {};
        errBack = errBack || function() {};
        options = options || {};
        options.type = options.type || "get";
        options.text = options.text || "正在操作...";
        options.isHide = ( options.isHide === false ) ? false : true;
        options.isLoading = ( options.isLoading === false ) ? false : true;
        options.headers = options.headers || {};
        options.middleware = options.middleware || {};

        if ( !url ) return;
        if ( !common.isFunction( callBack ) ) return;
        if ( !common.isFunction( errBack ) ) return;

        options.isLoading && common.popBox({
            loading: options.text,
            mask: false,
            time: true
        });

        oAjaxParams = {
            url: url,
            data: data,
            headers: options.headers,
            type: options.type.toLocaleUpperCase(),
            success: function( data ) {
                options.isHide && options.isLoading && common.popBoxHide();

                try {
                    data = common.isString( data ) ? JSON.parse( data ) : data;
                } catch ( err ) {
                    data = { code: -1, msg: "数据格式错误!" };
                }

                // 登录超时, 未登录, token无效
                if ( data.code === -1005 || data.code === -1006 || data.code === -1008  ) {
                    return common.goto( "/admin/login" );
                }

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
                    btn: "重试",
                    success: function( source ) {
                        if ( source === "yes" ) return errBack();
                    }
                });
            }
        };

        // 中间件必须是对象
        if ( common.isEmptyValue( options.middleware ) ) {
            for ( var m in options.middleware ) {
                oAjaxParams[m] = options.middleware[m];
            }
        }

        $.ajax( oAjaxParams );
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

    /**
     * @method common.pullLoad
     * @description 滑动到底部加载更多
     *
     * @param {String} elName 要监听的元素名
     * @param {Function} cb 触发成功的回调
     * @param {Number} distance 距离底部多少距离触发
     */
    common.pullLoad = function( elName, cb, distance ) {

        var scrollTop = 0, offsetHeight = 0, clientHeight = 0, doc = document,
            element, dom = null, handleQueue = [], isRelease = true, isTouchEnd = false,
            cbHandle, triggerHandle, checkScroll, scrollHandle, touchHandle;

        distance = distance || 30;

        if ( common.isFunction( elName ) ) {
            cbHandle = elName;
            offsetHeight = common.h;
        } else {
            element = elName;
            cbHandle = cb;
            dom = common.id( element );
        }

        // 触发回调
        triggerHandle = function() {
            var cbb = handleQueue[0];

            if ( !isRelease || !common.isFunction( cbb ) ) return;
            isRelease = false;

            setTimeout(function() {
                cbb();
                handleQueue = [];
                isRelease = true;
            }, 100 );
        };

        // 监听触摸来判断是否执行加载
        touchHandle = function( evt ) {

            evt = evt || {};
            switch ( evt.type ) {
                case "touchstart":
                    isTouchEnd = false;
                    break;
                case "touchend":
                case "touchcancel":
                    isTouchEnd = true;
                    checkScroll();
                    break;
            }
        };

        // 实时检测滚动条是否到底和元素高度
        checkScroll = function() {

            if ( dom ) {
                !offsetHeight && ( offsetHeight = dom.offsetHeight );
                scrollTop = dom.scrollTop;
                clientHeight = dom.querySelector( "div" ).offsetHeight;
            } else {
                scrollTop = document.body.scrollTop;
                clientHeight = document.body.offsetHeight;
            }

            if ( !isTouchEnd || ( clientHeight <= offsetHeight ) ) return;
            if ( ( offsetHeight + scrollTop + distance ) >= clientHeight ) {
                handleQueue.push( cbHandle );
                triggerHandle();
            }
        };

        // scroll实时回调
        scrollHandle =  function() {
            checkScroll();
        };

        common.off( dom || doc.body, "scroll", scrollHandle );
        common.off( dom || doc.body, "touchstart", touchHandle );
        common.off( dom || doc.body, "touchend", touchHandle );
        common.off( dom || doc.body, "touchcancel", touchHandle );

        common.on( dom || doc.body, "scroll", scrollHandle );
        common.on( dom || doc.body, "touchstart", touchHandle );
        common.on( dom || doc.body, "touchend", touchHandle );
        common.on( dom || doc.body, "touchcancel", touchHandle );
    };

    /**
     * @method Scroll
     * @description 监听滚动条
     *
     * @param {Object || String} elm 元素名或者元素对象
     * @param {Boolean} off 是否解绑事件
     */
    common.Scroll = (function() {
        var callback = function( e ) {
            var evt = e.currentTarget,
                parentH = evt.offsetHeight,
                sonH = evt.querySelector( "div" ).offsetHeight,
                value = sonH - parentH,
                top = evt.scrollTop;

            if ( value < 0 ) return;
            if ( e.type === "scroll" ) {
                if ( Math.abs( evt.scrollTop ) <= 5 ) evt.scrollTop = 1;
                if ( top > value ) return false;
                if ( value <= evt.scrollTop ) evt.scrollTop = value - 1;
            }
        };

        var scroll = function( elm, off ) {

            elm = $( elm || "body" );

            if ( !elm.length ) return;

            elm[0].scrollTop = 1;
            if ( off && typeof off === "boolean" ) {
                return elm.off( "scroll", callback );
            }

            elm.on( "scroll", callback );
        };

        return scroll;
    })();

    return common;

});