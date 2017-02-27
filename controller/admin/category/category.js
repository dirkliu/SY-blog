
var controller = {},
    Category = require( './categoryModel' );

controller[ 'query' ] = function( req, res ) {

    Category.query(function( err, data ) {
        if ( err && err.code ) return;
        return res.render('admin/addType', {
            title: '-分类管理',
            data: data
        });
    });
};

controller[ 'save' ] = function( req, res ) {

    var param = req.body,
        options  = {
            cateName: param.cateName,
            parentId: param.parentId,
            desc: param.desc,
            id: param.id
        },
        category = new Category( options );

    category.save( options, function( err, data ) {
        var code = 0, msg = data;
        if ( err && err.code ) {
            code = err.code;
            msg = err.msg;
        }
        return res.json( returnFactory( code, msg ) );
    });
};

controller[ 'delete' ] = function( req, res ) {

    Category.delete( req.body.id, function( err, data ) {
        var code = 0, msg = data;
        if ( err && err.code ) {
            code = err.code;
            msg = err.msg;
        }
        return res.json( returnFactory( code, msg ) );
    });
};

module.exports = controller;









