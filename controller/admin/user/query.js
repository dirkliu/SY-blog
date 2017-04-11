
var controller = {},
    authoritys = tools.require( '/config/authoritys' ),
    userQueryModel = require( './userQueryModel' );

controller[ 'init' ] = function( req, res ) {

    var query = req.query,
        options = {
            pageSize: 200,
            query: {
                name: query.userName || ''
            }
        },
        returnData = {
            list: []
        };

    userQueryModel.query( options, function( err, data ) {

        if ( err ) {
            returnData.errorMsg = err;
        } else {
            returnData = data;
        }

        return res.render( 'admin/user/query', {
            title: '-用户列表',
            data: returnData,
            authority: authoritys
        });
    });
};

module.exports = controller;









