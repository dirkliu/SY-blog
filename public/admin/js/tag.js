
(function( o ) {

    var _this = o();
    if ( typeof exports === "object" ) {
        module.exports = _this;
    } else if ( typeof define === "function" && define.amd ) {
        define( [], function() {
            return _this;
        });
    } else {
        window[ "Tag" ] = _this;
    }
})(function() {

    var tag = {}, controller = {}, view = {},
        model = {
            touch: {},
            isAdd: true,
            id: null
        },
        tagName = $( "#tagName" ),
        el = $( "#warp" );

    // 新增标签
    controller.add = function( options ) {
        var url = "/admin/tag";

        options = options || {};
        common.fetch( url, options, function( err ) {
            if ( err === false ) return;
            common.goto();
        }, function() {}, { type: "post" } );
    };

    // 删除标签
    controller.delete = function( options ) {
        var url = "/admin/tag/delete/" + model.id;

        options = options || {};
        if ( !model.id ) {
            return common.popBox({
                loading: "id不能为空",
                mask: true
            });
        }

        common.fetch( url, options, function( err ) {
            if ( err === false ) return;
            common.goto();
        }, function() {}, { type: "DELETE" } );
    };

    // 修改标签
    controller.patch = function( options ) {
        var url = "/admin/tag/patch/" + model.id;

        options = options || {};
        if ( !model.id ) {
            return common.popBox({
                loading: "id不能为空",
                mask: true
            });
        }

        common.fetch( url, options, function( err ) {
            if ( err === false ) return;
            common.goto();
        }, function() {}, { type: "PATCH" } );
    };

    // 事件绑定
    view.bindEvent = function() {

        el
            .on( "tap", ".ok", function() {
                var tagNameValue;

                tagNameValue = tagName.val().trim();
                if ( !tagNameValue ) {
                    return common.popBox({
                        loading: "标签名不能为空",
                        mask: true
                    });
                }

                // 新增
                if ( model.isAdd ) {
                    return controller.add({
                        tagName: tagNameValue
                    });
                }

                // 修改
                controller.patch({
                    tagName: tagNameValue
                });
            })

            // 修改
            .on( "tap", ".update", function() {
                var self = this, text;

                text = self.dataset.text;
                model.id = self.id;
                model.isAdd = false;

                if ( !text ) return;
                $( ".ok" ).html( "修改" );
                tagName.val( text );
            })

            // 删除
            .on( "tap", ".del", function() {
                var self = this;
                model.id = self.id;

                common.popBox({
                    title: "十月提示",
                    content: "是否删除此标签",
                    mask: true,
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.delete();
                    }
                });
            })


            // 点击初始化
            .on( "tap", '.cateTitle', function() {
                var data = this.dataset,
                    moveMillisecond = 0;

                $( this ).addClass( "transition" ).css({
                    transform: "translate3d( 0, 0, 0 )"
                });

                moveMillisecond = parseFloat(document.defaultView.getComputedStyle( this, "" )
                        .getPropertyValue("-webkit-transition-duration")) * 1000;

                setTimeout(function() {
                    data.tap = "0";
                }, moveMillisecond );
            })

            .on( 'touchstart', '.cateTitle', function( e ) {

                var data = this.dataset,
                    touches = e.changedTouches;

                if ( touches.length !== 1 ) return;
                if ( data.tap === "1" ) return;

                $( this ).removeClass( "transition" );
                model.touch.startX = touches[0].pageX;
                model.touch.startY = touches[0].pageY;
            })

            .on( 'touchmove', '.cateTitle', function( e ) {
                var data = this.dataset,
                    touches = e.changedTouches,
                    moveX = 0, moveY = 0;

                if ( touches.length !== 1 ) return;
                if ( data.tap === "1" ) return;

                model.touch.moveX = moveX = touches[0].pageX - model.touch.startX;
                model.touch.moveY = moveY = touches[0].pageY - model.touch.startY;

                if ( moveY > 10 ) {
                    model.touch.direction = "down";
                    return;
                }

                if ( moveY < -10 ) {
                    model.touch.direction = "up";
                    return;
                }

                if ( moveX > 10 ) {
                    moveX = 0;
                    model.touch.direction = "right";
                    return;
                }

                if ( moveX < -10 ) {
                    e.preventDefault();
                    model.touch.direction = "left";

                    if ( Math.abs( moveX ) >= 100 ) {
                        data.tap = "1";
                        return;
                    }

                    this.dataset.code = Math.abs( moveX );
                    $( this ).css({
                        transform: "translate3d( "+ moveX +"px, 0, 0 )"
                    });
                }
            })

            // end处理机制, 恢复
            .on( 'touchend', '.cateTitle', function( e ) {

                var data = this.dataset, code = data.code || 0,
                    moveX = model.touch.moveX;

                moveX = Number( code ) < 50 ? 0 : -100;
                data.code = moveX;
                data.tap = moveX ? "1" : "0";

                $( this ).addClass( "transition" ).css({
                    transform: "translate3d( "+ moveX +"px, 0, 0 )"
                });
            })
    };

    tag.setModel = function( data, param ) {
        data = data || "[]";
        model[ param ] = JSON.parse( data );
    };

    view.bindEvent();

    return tag;
});











