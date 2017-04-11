
var controller = {},
    userRole = tools.require( 'config/userRole'),
    regModel = require( './regModel' );

controller[ 'init' ] = function( req, res ) {
    return res.render( 'user/reg', {
        title: '注册'
    });
};

// 注册
controller[ 'register' ] = function( req, res ) {

    var body = req.body,
        oReg = {
            name            : body.userName,
            password        : tools.md5( body.passWord ),
            email           : body.email,

            // 自动获取
            ip              : tools.ip( req ),
            createTime      : tools.day.timeSeconds(),
            level           : 100,
            role            : []
        };

    regModel.checkUser( oReg.name, function( err, data ) {

        if ( err ) return res.json( returnFactory( -1, err ) );

        oReg.role = userRole[ oReg.level ][ 'authority' ];
        regModel.register( oReg, function( err, regUser ) {

            var returnMsg = err ? [ -1, err ] : [ 0, regUser ];
            return res.json( returnFactory.apply( null, returnMsg ) );
        });
    });
};

module.exports = controller;