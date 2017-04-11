
var articleView = (function() {

    var bindEvent, init, controller = {}, view = {},
        model = {
            id: null,
            categoryId: common.g( "categoryId" )
        },
        dom = {
            el: $( "body" ),
            page: $( "#page" ),
            mask: $( ".mask" )
        };

    // 局部更新操作
    controller.patch = function( options, cbHandle ) {
        var url = "/admin/article/patch/" + model.id;

        options = options || {};
        if ( !common.isEmptyValue( options ) || !model.id ) {
            return common.popBox({
                loading: "没有更新的内容",
                mask: false,
                time: 1
            });
        }

        common.fetch( url, options, function( err, data ) {
            model.id = null;
            if ( err === false ) return;
            cbHandle();
        }, controller.patch, { type: "PATCH" } );
    };

    // 删除文档
    controller.delete = function( cbHandle ) {
        var url = "/admin/article/delete/" + model.id;

        if ( !model.id ) {
            return common.popBox({
                loading: "请删除指定的文档id",
                mask: false,
                time: 1
            });
        }

        common.fetch( url, {}, function( err, data ) {
            model.id = null;
            if ( err === false ) return;
            cbHandle();
        }, controller.patch, { type: "DELETE" } );
    };

    view.setScroll = function() {
        dom.pageList[0].scrollTop = ( model.key - 1 ) * 45;
    };

    // 绑定事件
    bindEvent = function() {
        dom.el

            // 分页
            .on( "tap", ".pageBtn", function() {
                var url = "/admin/article/query",
                    params = "", i,
                    key = this.dataset.key,
                    o = {
                        page: key,
                        categoryId: model.categoryId
                    };

                for ( i in o ) {
                    if ( o[i] ) {
                        params = params + "&"+ i +"=" + encodeURI( o[i] );
                    }
                }

                common.goto( url + "?" + params.slice( 1 ) );
            })

            // 弹出分页
            .on( "tap", ".icon-page", function() {
                dom.page.removeClass( "hide" );
                dom.mask.removeClass( "hide" );
                common.ModalHelper.afterOpen();
                view.setScroll();
            })

            // 关闭分页
            .on( "tap", ".mask", function() {
                dom.page.addClass( "hide" );
                setTimeout(function() {
                    dom.mask.addClass( "hide" );
                }, 300);
                common.ModalHelper.beforeClose();
            })

            // 评论, 阅读
            .on( "tap", ".openComment, .openRead", function() {

                var self = this, options = {}, id = self.id;
                id && ( model.id = id );

                if ( this.classList.contains( "openComment" ) ) options.isComment = 0;
                if ( this.classList.contains( "openRead" ) ) options.isRead = 0;

                common.popBox({
                    title: "十月提示",
                    content: "是否开启此项?",
                    mask: true,
                    btn: "开启",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.patch( options, function() {
                            $( self ).remove();
                        });
                    }
                });
            })

            // 删除
            .on( "tap", ".delete", function() {

                var self = this, id = self.id;
                id && ( model.id = id );

                common.popBox({
                    title: "十月提示",
                    content: "是否删除此文章?",
                    mask: true,
                    btn: "删除",
                    success: function( source ) {
                        if ( source !== "yes" ) return;
                        controller.delete(function() {
                            $( self ).parents( ".article-list" ).remove();
                        });
                    }
                });
            })

            // 修改
            .on( "tap", ".update", function() {

                var self = this, id = self.id;
                common.goto( "/admin/article/add?id=" + id );
            });

        common.Scroll( ".page" );
    };

    init = function() {
        model.key = dom.page.find( ".pageBtn.on" ).data( "key" ) | 0;
        dom.pageList = dom.page.find( ".page" );
    };

    return function() {
        init();
        bindEvent();
    };

})();

articleView();
