/**
 * Created by Administrator on 2016/12/13.
 */

var regView = (function() {

    var bindEvent,
        model = {},
        oReg = {},

        el = $( "#reg" ),
        regBtnId = $( ".regBtn" ),
        userNameId = $( "#userName" ),
        passWordId = $( "#passWord" ),
        passWordRepeatId = $( "#passWord-repeat" ),
        emailId = $( "#email" );

    // 注册
    oReg.post = function() {
        var o = {
            userName: model.userName,
            passWord: model.passWord,
            email: model.email
        };
        common.fetch( "/reg", o, function( err, data ) {
            if ( err === false ) return;
            common.goto( "/admin/login" );
        }, oReg.post, { type: "post" } );
    };

    oReg.getValue = function() {
        model.userName = userNameId.val().trim();
        model.passWord = passWordId.val().trim();
        model.passWordRepeat = passWordRepeatId.val().trim();
        model.email = emailId.val().trim();
    };

    // 绑定事件
    bindEvent = function() {
        el

            .on( "keyup", "#reg input", function( e ) {
                if ( e.keyCode !== 13 ) return;
                regBtnId.trigger( "click" );
            })

            .on( "click", ".regBtn", function() {

                var errText = null;

                oReg.getValue();
                if ( model.passWord !== model.passWordRepeat ) errText = "两次输入的密码不一致!";
                if ( !model.userName || !model.passWord ) errText = "用户名密码不能为空!";
                if ( errText ) {
                    return common.popBox({
                        loading: errText,
                        time: 1
                    });
                }

                oReg.post();
            });
    };

    return function() {
        bindEvent();
    };

})();

regView();
