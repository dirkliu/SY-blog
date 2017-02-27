
var controller = {},
    userRole = tools.require( 'config/userRole'),
    regModel = require( './regModel' );

controller[ 'init' ] = function( req, res ) {

    res.render( 'user/reg', {
        title: '注册'
    });
};

controller[ 'register' ] = function( req, res ) {

    var body = req.body,
        oReg = {
            name: body.userName,
            password: tools.md5( body.passWord ),
            email: body.email,
            level: 100,
            role: []
        };

    regModel.checkUser( oReg.name, function( err, data ) {

        if ( err ) return res.json( returnFactory( err ) );

        oReg.role = userRole[ oReg.level ][ 'authority' ];
        regModel.register( oReg, function( err, regUser ) {

            if ( err ) return res.json( returnFactory( err ) );
            return res.json( returnFactory( 0, regUser ) );

        });

    });

};

module.exports = controller;