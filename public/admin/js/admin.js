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
        window[ "Admin" ] = _this;
    }
})(function() {

    var admin = {},

        nav = $( ".nav" ),
        body = $( "body" );

    body
        .on( "tap", ".icon-nav", function() {
            nav.addClass( "on" );
            nav.find( ".mask" ).removeClass( "hide" );
            common.ModalHelper.afterOpen();
        })

        .on( "tap", ".mask", function() {
            nav.removeClass( "on" );
            common.ModalHelper.beforeClose();
        });

    return admin;

});