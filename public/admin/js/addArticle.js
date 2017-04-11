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
        window[ "Article" ] = _this;
    }
})(function() {

    var article = {}, view = {},
        model = {
            source: null,
            data: {
                title: {
                    text: '文章标题',
                    value: '',
                    required: true
                },
                categoryId: {
                    text: '分类',
                    value: '',
                    required: true
                },
                author: {
                    text: '作者',
                    value: '',
                    required: true
                },
                source: {
                    text: '来源',
                    value: '',
                    required: true
                },
                tag: [],
                like: 0,
                read: 0,
                recommendLevel: 0,
                isComment: 0,
                isRead: 0,
                keyWord: '',
                desc: '',
                content: ''
            }
        },
        tagId = $( "#tagId" ),
        articleId = $( "#articleId" );


    // 新增和修改
    article.submit = function() {
        var data = model.data,
            o = {},
            type = "post",
            url = "/admin/article/save";

        for ( var i in data ) {
            o[i] = common.isObject( data[i] ) ? data[i].value : data[i];
        }

        if ( model.source === "put" ) {
            url = "/admin/article/put/" + model.id;
            type = "put";
        }

        common.fetch( url, o, function( err, data ) {

            if ( err === false ) return;
            common.goto();
        }, article.submit, { type: type } );
    };

    article.setModel = function( data ) {
        var i, mData = model.data;
        data = JSON.parse( data );

        if ( !common.isEmptyValue( data ) ) return;

        // 循环插入数据
        model.id = data._id;
        for ( i in mData ) {
            if ( common.isObject( mData[i] ) ) {
                mData[i].value = data[i];
            } else {
                mData[i] = data[i] || "";
            }
        }
    };

    // 获取选中的tag标签
    view.tagValue = function() {
        var valueArr = [];
        tagId.find( ".tagBtn.on" ).each(function( index, item ) {
            valueArr.push( item.id );
        });

        model.data.tag = JSON.stringify( valueArr );
    };

    article.bindEvent = function() {

        articleId

            // 标签btn
            .on( "tap", ".tagBtn", function() {

                if ( this.classList.contains( "on" ) ) {
                    this.classList.remove( "on" );
                } else {
                    this.classList.add( "on" );
                }
            })

            .on( "input", ".textInput", function() {
                var val = this.value.trim();
                if ( !val ) return;
                var o = model.data;
                if ( common.isObject( o[ this.name ] ) ) {
                    o[ this.name ].value = val;
                } else {
                    o[ this.name ] = val;
                }
            })

            .on( "change", ".textSelect", function() {
                var val = this.value.trim();
                if ( !val ) return;
                var o = model.data;
                if ( common.isObject( o[ this.name ] ) ) {
                    o[ this.name ].value = val;
                } else {
                    o[ this.name ] = val;
                }
            })

            // 保存
            .on( "tap", "#submitBtn", function() {
                var data = model.data,
                    isPass = true, errText;

                for ( var i in data ) {
                    if ( !data[i].value && data[i].required ) {
                        errText = data[i].text;
                        isPass = false;
                        break;
                    }
                }

                view.tagValue();

                if ( !isPass ) {
                    return common.popBox({
                        loading: '请输入必填项: ' + errText,
                        time: 1
                    });
                }

                model.source = this.dataset.source;
                article.submit();
            });
    };
    article.render = function() {};

    article.render();
    article.bindEvent();

    return article;

});

// 生成数据表
/*
window.testAjax = {
    url: "/admin/article/save",
    errMsg: [],
    guid: 1000,
    categoryArr: [ "58a83b90ccde0b24a8cc7a43", "58a935ff3475180da49e50b3" ],
    data: function() {
        var guid = this.guid++,
            categoryArr = this.categoryArr,
            random = Math.random() * categoryArr.length | 0,
            data = {
                "title": "测试标题" + guid,
                "categoryId": categoryArr[ random ],
                "author": "测试" + guid,
                "source": "测试" + guid,
                "like": guid,
                "read": guid,
                "isComment": Math.random() * 2 | 0,
                "isRead": Math.random() * 2 | 0,
                "keyWord": "关键字" + guid,
                "desc": "说明" + guid,
                "content": "内容" + guid
            };

        if ( !data.categoryId ) return null;
        return data;
    },
    start: function( repeatNum ) {
        var self = this;
        if ( repeatNum < 0 ) return;

        for ( var i = 0; i < repeatNum; i++ ) {
            (function( j ) {
                var data = self.data();

                if ( !data ) return;
                common.fetch( self.url, data, function( err, data ) {

                    if ( err === false ) {
                        data.index = j;
                        return self.errMsg.push( data );
                    }
                }, function(){}, { type: 'post' } );
            })( i );
        }
    }
};
*/












