
var controller = {};

controller[ 'render' ] = function( res, data ) {
    return res.render( 'admin/base/link', {
        title: '-友情链接',
        data: data
    });
};

controller[ 'init' ] = function( req, res ) {

    var query = req.query,
        options = {
            query: {
            },
            sort: {
                createTime: -1
            },
            pageSize: 30
        },
        returnData = {
            list: []
        };

    return controller[ 'render' ]( res, returnData );

    /*model.query( options, function( err, data ) {
        if ( err ) {
            returnData.errorMsg = err;
        } else {
            returnData = data;
        }
        return controller[ 'render' ]( res, returnData );
    });*/
};

module.exports = controller;









