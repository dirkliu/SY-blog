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
        window[ "AuthorityApi" ] = _this;
    }
})(function() {

    var authorityApi = {},
        model = {},
        el = $( "#authorityApi" );

    // 转换path发送
    authorityApi.toEncode = function( str ) {
        return str.replace( /\/|:/g, "" );
    };

    // 删除接口
    authorityApi.delete = function( fn ) {
        var o = {},
            url = "/admin/authority/api/delete/" + model.path;

        common.fetch( url, o, function( err ) {

            var msg = "删除成功";
            if ( err === false ) msg = "删除失败";
            common.popBox({
                loading: msg,
                mask: true
            });
            !err && fn();
        }, function() {}, { type: "DELETE" } );
    };

    // 修改接口权限
    authorityApi.patch = function() {
        var o = {},
            url = "/admin/authority/api/patch/" + model.path;

        o.authority = model.authority;
        common.fetch( url, o, function( err ) {

            var msg = "修改成功";
            if ( err === false ) msg = "修改失败";
            common.popBox({
                loading: msg,
                mask: true
            });
        }, authorityApi.patch, { type: "PATCH" } );
    };

    // 事件绑定
    authorityApi.bindEvent = function() {
        el

            .on( "focus", ".authority", function() {
                var auth = $( this ).parent( ".auth" );

                auth.css({
                    border: "1px solid #CE5462;"
                });
            })

            .on( "blur", ".authority", function() {
                var auth = $( this ).parent( ".auth" );

                auth.css({
                    border: "1px solid #f6f6f6;"
                });
            })

            // 删除接口
            .on( "tap", ".delete", function() {
                var self = this, id = self.id;

                if ( !id ) return;

                model.path = authorityApi.toEncode( id );
                common.popBox({
                    title: "十月提示",
                    content: "是否删除此接口?",
                    mask: true,
                    btn: "确定删除",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        authorityApi.delete(function() {
                            $( self ).parents( ".article-list" ).remove();
                        });
                    }
                });
            })

            // 修改权限码
            .on( "tap", ".update", function() {
                var self = this,
                    id = self.id,
                    dataSet = self.dataset,
                    parentDom = $( self ).parents( ".article-list" ),
                    authority = parentDom.find( ".authority" ).val().replace( /\s+/g, "" );

                if ( !id || !authority ) return;
                if ( authority === dataSet.code ) {
                    return common.popBox({
                        loading: "内容未作修改",
                        mask: true
                    });
                }

                model.authority = authority;
                model.path = authorityApi.toEncode( id );
                common.popBox({
                    title: "十月提示",
                    content: "是否修改权限码?",
                    mask: true,
                    btn: "确定修改",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        authorityApi.patch();
                    }
                });
            })
    };

    authorityApi.setModel = function( data ) {
        data = data || "[]";
        model.data = JSON.parse( data );
    };

    authorityApi.bindEvent();

    return authorityApi;

});











