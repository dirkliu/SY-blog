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
        window[ "Recommend" ] = _this;
    }
})(function() {

    var recommend = {}, controller = {}, view = {},
        model = {
            id: null
        },
        el = $( "#warp" );

    // 取消推荐
    controller.patch = function( options, fn ) {
        var url = "/admin/recommend/patch/" + model.id;

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

    // 事件绑定
    view.bindEvent = function() {

        el

            .on( "tap", ".cancel", function() {
                var self = this;
                model.id = self.id;

                common.popBox({
                    title: "十月提示",
                    content: "是否取消推荐",
                    mask: true,
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.patch({
                            recommendLevel: "0"
                        }, function() {
                            common.popBox({
                                loading: "取消成功",
                                mask: true,
                                success: function() {
                                    $( self ).parents( ".article-list" ).remove();
                                }
                            });
                        });
                    }
                });
            })
    };

    recommend.setModel = function( data, param ) {
        data = data || "[]";
        model[ param ] = JSON.parse( data );
    };

    view.bindEvent();

    return recommend;
});











