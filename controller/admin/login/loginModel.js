/**
 *  @method LoginModel
 *  @description 用户登录的模型
 */

var LoginModel = {},
    loginService = tools.require( 'service/admin/login/login' );

LoginModel.login = function( userName, cbHandle ) {

    loginService.checkUser( userName, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = LoginModel;