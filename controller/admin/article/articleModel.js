
var Article = {},
    serviceArticle = tools.require( 'service/admin/article/article' );

// 获取文章信息
Article.query = function( options, cbHandle ) {

    options = options || {};

    options.query = tools.filterEmpty( options.query );     // 过滤查询条件
    options.sort = tools.filterEmpty( options.sort );       // 过滤查询条件
    options = tools.filterEmpty( options );                 // 过滤顶级参数

    // 调用service接口
    serviceArticle.query( options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 局部更新
Article.patch = function( id, options, cbHandle ) {
    serviceArticle.patch( id, options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 保存接口
Article.save = function( options, cbHandle ) {
    serviceArticle.save( options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 删除
Article.delete = function( id, cbHandle ) {
    serviceArticle.delete( id, function( err, data ) {
        cbHandle( err, data );
    });
};

// 修改
Article.put = function( id, options, cbHandle ) {
    Article.patch( id, options, cbHandle );
};

// 查询详细页
Article.queryDetail = function( id, cbHandle ) {
    serviceArticle.queryDetail( id, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = Article;