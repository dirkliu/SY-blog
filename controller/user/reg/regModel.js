
var regModel = {},
    regService = tools.require( 'service/reg/reg' );

regModel.checkUser = function( userName, cbHandle ) {
    regService.checkUser( userName, function( err, data ) {
        cbHandle( err, data );
    })
};


regModel.register = function( options, cbHandle ) {
    regService.register( options, function( err, data ) {
        cbHandle( err, data );
    })
};

module.exports = regModel;