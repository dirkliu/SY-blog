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
        window[ "UserQuery" ] = _this;
    }
})(function() {

    var userQuery = {}, controller = {}, view = {}, helper = {},
        model = {
            checkRoleArr: [],
            touch: {},
            id: null
        },
        userNameId = $( "#userName" ),
        searchBtn = $( ".search-btn" ),
        addAuthority = $( ".add-authority" ),
        renderAuthority = $( "#renderAuthority" ),
        el = $( "#userQuery" );

    // 搜索
    controller.search = function() {
        var params = "userName=" + model.userName,
            url = "/admin/user/query?" + params;
        common.goto( url );
    };

    // 删除用户
    controller.delete = function( fn ) {
        var o = { isFreeze: true },
            url = "/admin/user/delete/" + model.id;

        if ( !model.id ) {
            return common.popBox({
                loading: "id不能为空",
                mask: true
            });
        }

        common.fetch( url, o, function( err ) {

            if ( err === false ) return;
            fn();
        }, controller.delete, { type: "DELETE" } );
    };

    // 设置冻结, 权限
    controller.patch = function( options, fn ) {
        var url = "/admin/user/patch/" + model.id;

        options = options || {};

        if ( !model.id ) {
            return common.popBox({
                loading: "id不能为空",
                mask: true
            });
        }

        common.fetch( url, options, function( err ) {

            model.id = null;
            if ( err === false ) return;
            fn();
        }, function() {}, { type: "PATCH" } );
    };

    // 验证
    controller.validata = {
        userName: function( value ) {
            var isPass = true;
            if ( !value || value.length <= 2 ) isPass = false;
            return isPass;
        }
    };

    // 根据value匹配出当前对象
    helper.matchValue = function( data, key, value ) {
        var res = null;
        data.forEach(function( item ) {
            if ( item[key] === value ) {
                return res = item;
            }
        });

        return res;
    };

    // 获取dom数据
    view.getValue = function() {
        model.userName = userNameId.val().trim();
    };

    // 关闭权限弹窗
    view.closeAddAuthority = function( flag ) {
        if ( flag ) {
            addAuthority.removeClass( "on" );
            common.ModalHelper.beforeClose();
        } else {
            addAuthority.addClass( "on" );
            common.ModalHelper.afterOpen();
        }
    };

    // 渲染权限列表
    view.renderAuthorityTpl = function( roleArr ) {
        var htmlStr = "", i,
            oAuthority = model.authority,
            len = Object.keys( oAuthority ).length;

        // 遍历权限码
        for ( i in oAuthority ) {
            len--;
            oAuthority[i].forEach(function( item ) {
                var currentClass = roleArr.indexOf( item ) > -1 ? "single on" : "single";
                htmlStr += "<li data-code="+ item +" class='"+ currentClass +"'>"+ item +"</li>";
            });

            if ( len ) {
                htmlStr += "<div class='division'></div>";
            }
        }
        renderAuthority.html( htmlStr );
    };

    // 事件绑定
    view.bindEvent = function() {

        // 搜索
        searchBtn.on( "tap", function() {
            view.getValue();
            if ( !controller.validata[ 'userName' ]( model.userName ) ) {
                return common.popBox({
                    loading: "用户名不能小于3个字符",
                    mask: true
                });
            }
            controller.search();
        });

        // 权限码页面
        addAuthority.on( "tap", function( e ) {
            var target = e.target,
                classList = target.classList;

            // 关闭弹窗
            if ( classList.contains( "mask" ) ) {
                return view.closeAddAuthority( true );
            }

            // 确定权限
            if ( classList.contains( "authority-btn" ) ) {
                model.checkRoleArr = [];
                renderAuthority.find( ".single.on" ).each(function( index, item ) {
                    model.checkRoleArr.push( item.dataset.code | 0 );
                });

                // 设置
                controller.patch({
                    role: JSON.stringify( model.checkRoleArr )
                }, function() {
                    common.popBox({
                        loading: "设置权限成功",
                        mask: true,
                        success: function() {
                            common.goto();
                        }
                    });
                });
                return view.closeAddAuthority( true );
            }

            // 点击单个
            if ( classList.contains( "single" ) ) {
                if ( classList.contains( "on" ) ) {
                    classList.remove( "on" );
                } else {
                    classList.add( "on" );
                }
            }
        });

        el

            // 设置权限
            .on( "tap", ".authority", function() {
                var self = this, result;
                model.id = self.id;

                result = helper.matchValue( model.data, "_id", model.id );
                view.renderAuthorityTpl( result.role );
                view.closeAddAuthority();
            })

            // 删除用户
            .on( "tap", ".delete", function() {
                var self = this;
                model.id = self.id;

                common.popBox({
                    title: "十月提示",
                    content: "是否删除此用户",
                    mask: true,
                    btn: "是",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.delete(function() {
                            common.popBox({
                                loading: "删除成功",
                                mask: true
                            });
                            $( self ).parent( "li" ).remove();
                            model.id = null;
                        });
                    }
                });
            })

            // 冻结
            .on( "tap", ".freeze", function() {
                var self = this, isFreeze = false,
                    tip = {
                        content: "确定要开启此用户吗?",
                        loading: "开启成功"
                    },
                    data = self.dataset;

                model.id = self.id;
                if ( !self.id ) return;

                if ( !data.freeze || data.freeze === "false" ) {
                    isFreeze = true;
                    tip.content = "是否要冻结此用户?";
                    tip.loading = "冻结成功"
                }

                common.popBox({
                    title: "十月提示",
                    content: tip.content,
                    mask: true,
                    btn: "是",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.patch({
                            isFreeze: isFreeze
                        }, function() {
                            common.popBox({
                                loading: tip.loading,
                                mask: true,
                                success: function() {
                                    common.goto();
                                }
                            });
                        });
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

                    if ( Math.abs( moveX ) >= 150 ) {
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

                moveX = Number( code ) < 50 ? 0 : -150;
                data.code = moveX;
                data.tap = moveX ? "1" : "0";

                $( this ).addClass( "transition" ).css({
                    transform: "translate3d( "+ moveX +"px, 0, 0 )"
                });
            })
    };

    userQuery.setModel = function( data, param ) {
        data = data || "[]";
        model[ param ] = JSON.parse( data );
    };

    view.bindEvent();

    return userQuery;

});











