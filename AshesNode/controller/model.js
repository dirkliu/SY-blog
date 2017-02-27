
var Model = function( app ) {

    var connect, error,
        path = require( 'path' );

    app = app || {};

    connect = function( routeName, opt ) {
        var pathName = path.resolve( __dirname, '..' );
        routeName = routeName || 'routes';

        return this;
    };

    return {
        connect: connect
    }
};

module.exports = Model;