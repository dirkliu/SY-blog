
var controller = {},
    Article = require( './articleModel' ),
    TagModel = tools.require( 'controller/admin/base/tag/model'),
    Category = tools.require( 'controller/admin/category/categoryModel' );

controller.model = {};

// 提取数据
controller.extractData = function( body ) {
    return {
        title               : body.title,
        categoryId          : body.categoryId,
        author              : body.author,
        source              : body.source,
        like                : body.like | 0,
        read                : body.read | 0,
        tag                 : JSON.parse( body.tag ),
        recommendLevel      : body.recommendLevel | 0,
        isComment           : body.isComment | 0,
        isRead              : body.isRead | 0,
        keyWord             : body.keyWord,
        desc                : body.desc,
        content             : body.content,
        createTime          : body.createTime || tools.day.timeSeconds()
    };
};

// 过滤出分类的类名
controller.cateFilter = function( cateId ) {

    var oCategory = controller.oCategory,
        returnCate = null;

    oCategory.forEach(function( item ) {
        var sonArr = item.son;
        tools.isArray( sonArr ) && sonArr.forEach(function( sItem ) {
            if ( sItem._id.toString() === cateId ) {
                return returnCate = sItem;
            }
        });
    });
    return returnCate;
};

// 处理分类字段
controller.cateAddField = function( arr ) {
    arr.forEach(function( item ) {
        item.category = controller.cateFilter( item.categoryId );
    });
    return arr;
};

// 获取tag标签
controller.queryTag = function( fn ) {
    var options = {
        query: {},
        sort: {
            createTime: -1
        },
        pageSize: 50
    };
    TagModel.query( options, function( err, data ) {
        fn( err ? [] : data.list || [] );
    });
};

// 获取全部分类
controller.getAllCategory = function( cbHandle ) {
    Category.query(function( err, data ) {
        cbHandle( err, data );
    });
};

// 查询文章 { render, api }
controller[ 'query' ] = function( req, res ) {

    controller.getAllCategory(function( err, oCategory ) {

        var query = req.query,
            options = {
                query: {},
                sort: {
                    createTime: -1
                },
                pageSize: query.pageSize,
                page: query.page
            };

        if ( err && err.code ) return;

        controller.oCategory = oCategory;
        options.query.categoryId = query.categoryId;

        // 查询数据
        Article.query( options, function( err, data ) {
            if ( err ) return res.json( returnFactory( -1, err ) );

            // 组装数据
            if ( data.list.length ) {
                data.list = controller.cateAddField( data.list );
            }

            writeLogs.response( req, data );
            return res.render( 'admin/article', {
                title: '-文章管理',
                data: data
            });
        });
    });
};

// 添加文章 { render }
controller[ 'add' ] = function( req, res ) {

    // 查询tag
    controller.queryTag(function( tagData ) {

        // 查询分类
        controller.getAllCategory(function( err, oCategory ) {

            var query = req.query,
                options = {
                    query: {
                        _id: query.id
                    }
                };

            // 如果id不存在, 表示是新增
            if ( !options.query._id ) {
                return res.render( 'admin/addArticle', {
                    title: '-添加文章',
                    source: 'add',
                    category: oCategory,
                    data: {},
                    tag: tagData
                });
            }

            // 查询数据
            Article.query( options, function( err, data ) {

                try {
                    data = data.list[0] || {};
                } catch ( err ) {
                    data = {};
                }

                // 查询详细集合数据
                Article.queryDetail( options.query._id, function( err, detail_data ) {

                    if ( err ) return res.json( returnFactory( -1, err ) );

                    data.content = detail_data.content;
                    return res.render( 'admin/addArticle', {
                        title: '-更新文章',
                        source: 'put',
                        category: oCategory || [],
                        data: data,
                        tag: tagData
                    });
                });
            });

        });
    });
};

// 保存 { api }
controller[ 'save' ] = function( req, res ) {

    var body = req.body,
        options = controller.extractData( body );

    Article.save( options, function( err, data ) {
        var params = err ? [ -300, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, params ) );
    });
};

// 更新局部数据 { api }
controller[ 'patch' ] = function( req, res ) {

    var body = req.body, i,
        id = req.params.ids, isPass,
        options = {};

    // 提取需要更新的字段
    for ( i in body ) {
        if ( body[i] === 'null' || body[i] === 'undefined' || !body[i] ) continue;
        isPass = true;
        options[i] = body[i];
    }

    if ( !id || !isPass ) return res.json( returnFactory( -1, '无更新信息' ) );

    options.isComment && ( options.isComment = options.isComment | 0 );
    options.isRead && ( options.isRead = options.isRead | 0 );
    Article.patch( id, options, function( err, data ) {
        if ( err ) {
            return res.json( returnFactory( -1, err ) );
        }
        return res.json( returnFactory( 0, data ) );
    });
};

// 删除文档 { api }
controller[ 'delete' ] = function( req, res ) {

    var id = req.params.ids;
    if ( !id ) return res.json( returnFactory( -1, '请指定删除的id' ) );

    Article.delete( id, function( err, data ) {
        if ( err ) {
            return res.json( returnFactory( -1, err ) );
        }
        return res.json( returnFactory( 0, data ) );
    });
};

// 修改文章 { api }
controller[ 'put' ] = function( req, res ) {
    var body = req.body,
        params = req.params, id,
        options = controller.extractData( body );

    id = params.ids;
    options.updateTime = tools.day.timeSeconds();
    delete options.createTime;

    Article.put( id, options, function( err, data ) {
        var params = err ? [ -22, err ] : [ 0, data ];
        return res.json( returnFactory.apply( null, params ) );
    });
};

module.exports = controller;









