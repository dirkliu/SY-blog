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
        window[ "UploadView" ] = _this;
    }
})(function() {

    var uploadView = {}, controller = {}, view = {},
        model = {
            id: null
        },
        el = $( "#upload" );

    // 事件绑定
    view.bindEvent = function() {

        var uploadView = new Upload.init( "#uploadFile", {
            url: "/upload",
            maxSize: 8,
            readerStart: function( data ) {
                console.log( "readerStart", data )
            },
            readerProgress: function( data ) {
                console.log( "readerProgress", data + "%" )
            },
            readerSuccess: function( data ) {
                console.log( "readerSuccess", ( data.length / 1024 | 0 ) + "k" )
            },
            uploadProgress: function( data ) {
                console.log( "uploadProgress", data, data.progress + "%" )
            },
            uploadSuccess: function( data ) {
                console.log( "uploadSuccess", data )
            }
        });

        uploadView.onError = function( data, type ) {
            console.log( "onError:", type, data );
        };

    };

    view.bindEvent();

    return uploadView;
});











