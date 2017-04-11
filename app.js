
var express = require( 'express' ),
    path = require( 'path' ),
    favicon = require( 'serve-favicon' ),
    logger = require( 'morgan' ),
    cookieParser = require( 'cookie-parser' ),
    bodyParser = require( 'body-parser' ),

    //session = require( 'express-session' ),
    //MongoStore = require( 'connect-mongo' )( session ),

    settings = require( './config/settings' ),
    configRoute = require( './config/route' ),
    AshesNode = require( './AshesNode/init' ),
    app = null;

require( './global' );

app = express();

//app.use(session({
//  secret: settings.cookieSecret,
//  key: settings.db,//cookie name
//  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//  store: new MongoStore({
//    url:"mongodb://localhost/"+settings.db,
//    ttl: 2 * 24 * 60 * 60, // = 14 days. Default
//    autoRemove:"native"
//  })
//}));

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( 'dev' ) );

app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '10mb', extended: true })); // for parsing application

app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// ashes注入
AshesNode.init( app ).route( configRoute );
AshesNode.pool({
  connect_options: {
    dbName: settings.db,
    hostName: settings.host,
    port: settings.port
  },
  max: 50,
  idleTimeoutMillis: 30000,
  log: false
});


// catch 404 and forward to error handler
app.use(function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
});

// error handler
app.use(function( err, req, res, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( 'common/error', {
    title: 'SHIYUE'
  });
});

module.exports = app;