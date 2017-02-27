/**
 * @date 2017.01.07
 * @method addTypeView
 */

var addTypeView = (function() {

    var bindEvent, init,
        model = {
            touch: {},
            currentId: ""
        },
        query = {},

        cateNameId, parentId, descId,
        el = $( "#content" );

    // 提交
    query.post = function() {
        var o = {
            cateName: model.cateName,
            parentId: model.parentId,
            desc: model.desc
        };

        if ( model.updateId ) {
            o.id = model.updateId;
        }
        common.fetch( "/admin/category/add", o, function( err, data ) {
            if ( err === false ) return;
            common.goto( "/admin/category/query" );
        }, query.post, { type: "post" } );
    };

    // 删除
    query.delete = function() {
        var o = {
            id: model.currentId
        };
        common.fetch( "/admin/category/delete", o, function( err, data ) {

            if ( err === false ) return;
            common.popBox({
                loading: "删除成功!",
                time: 1,
                success: function() {
                    common.goto( "/admin/category/query" );
                }
            });
        }, function() {}, { type: "delete" } );
    };

    model.getValue = function() {
        model.cateName = cateNameId.val();
        model.parentId = parentId.val();
        model.desc = descId.val();
    };

    // 绑定事件
    bindEvent = function() {
        el
            .on( 'tap', '#addCateBtn', function() {
                model.getValue();
                if ( !model.cateName ) {
                    common.popBox({
                        loading: "请填写类别信息!",
                        time: 1
                    });
                    return;
                }

                query.post();
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

            // 删除
            .on( "tap", ".del", function( e ) {
                var id = this.id, li = $( e.target ).parent( "li" );
                model.currentId = id;
                common.popBox({
                    title: "SYUI提示",
                    content: "确定删除？",
                    success: function() {
                        query.delete();
                    }
                });

            })

            // 更改
            .on( "tap", ".update", function() {
                var id = this.id, data = this.dataset;
                model.currentId = id;

                cateNameId.val( data.code );
                parentId.val( id );
                descId.val();
                model.updateId = id;
            })
    };

    init = function() {
        cateNameId = $( "#cateNameId" );
        parentId = $( "#parentId" );
        descId = $( "#descId" );
    };

    return function() {
        init();
        bindEvent();
    };

})();

addTypeView();
