
var controller = {},
    generateSign = tools.require( "logic/token/generateSign" ),
    loginModel = require( "./loginModel" );

controller[ 'init' ] = function( req, res ) {
    return res.render( 'admin/login', {
        title: '登录'
    });
};

controller[ 'submit' ] = function( req, res ) {

    var body = req.body,
        userName = body.userName,
        passWord = body.passWord;

    loginModel.login( userName, function( err, data ) {

        // 如果失败
        if ( err ) {
            return res.json( returnFactory( err ) );
        }

        // 密码不正确
        if ( data.password !== tools.md5( passWord ) ) {
            return res.json( returnFactory( -1, '密码不正确' ) );
        }

        // 生成sign
        generateSign.create({
            payload: data,
            req: req
        }, function( data ) {
            res.cookie( "token", data, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } );
            return res.json( returnFactory( 0, data ) );
        });

    });
};

module.exports = controller;