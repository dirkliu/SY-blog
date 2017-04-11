/**
 * Created by Administrator on 2016/12/13.
 */

var loginView = (function() {

    var bindEvent,
        model = {},
        oLogin = {},

        el = $( "#login" ),
        loginBtnId = $( ".loginBtn" ),
        userNameId = $( "#userName" ),
        passWordId = $( "#passWord" );

    // 登录
    oLogin.post = function() {
        var o = {
            userName: model.userName,
            passWord: model.passWord
        };
        common.fetch( "/admin/login", o, function( err, data ) {
            if ( err === false ) return;
            common.goto( "/admin/category/query" );
        }, oLogin.post, { type: "post" } );
    };

    oLogin.getValue = function() {
        model.userName = userNameId.val().trim();
        model.passWord = passWordId.val().trim();
    };

    // 绑定事件
    bindEvent = function() {
        el
            .on( "keyup", "#login input", function( e ) {
                if ( e.keyCode !== 13 ) return;
                loginBtnId.trigger( "click" );
            })

            .on( "click", ".loginBtn", function() {

                oLogin.getValue();
                if ( !model.userName || !model.passWord ) {
                    return common.popBox({
                        loading: "用户名密码不能为空!",
                        time: 1
                    });
                }

                oLogin.post();
            })

            // 注册
            .on( "tap", ".regBtn", function() {
                common.goto( "/reg" );
            })
    };

    return function() {
        bindEvent();
    };

})();

loginView();
