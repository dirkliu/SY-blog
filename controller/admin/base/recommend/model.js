
var Model = {},
    ArticleModel = tools.require( 'controller/admin/article/articleModel' );

Model.query = function( options, cbHandle ) {
    ArticleModel.query( options, function( err, data ) {
        cbHandle( err, data );
    });
};

Model.patch = function( id, options, cbHandle ) {
    ArticleModel.patch( id, options, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = Model;