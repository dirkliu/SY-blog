
var code = tools.require( 'config/errorCode' );
var httpCode = code[ 'http' ];
var errorCode = code[ 'error' ];

var oResponse = {
    error: function( code, msg ) {

        msg = msg || httpCode[ code ];
        this.status( code ).json({
            code: code,
            time: + new Date(),
            msg: msg
        });
    }
};

module.exports = oResponse;