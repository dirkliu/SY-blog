
var controller = {},
    userRole = tools.require( 'config/userRole'),
    generateSign = tools.require( "logic/token/generateSign" );

controller[ 'init' ] = function( req, res ) {
    // 生成sign
    generateSign.create({
        payload: {
            level: 100,
            role: userRole[ 100 ][ 'authority' ]
        },
        req: req
    }, function( data ) {
        res.cookie( "token", data, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } );
        return res.json( returnFactory( 0, data ) );
    });
};

module.exports = controller;