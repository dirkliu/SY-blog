
var fs = require( 'fs' );
var controller = {};

controller[ 'init' ] = function( req, res ) {
    return res.render( 'demo/upload', {
        title: '-图片上传'
    });
};

controller[ 'post' ] = function( req, res ) {
    var body = req.body;

    var imgData = body.base64Str.replace(/^data:image\/\w+;base64,/, '');

    var dataBuffer = new Buffer(imgData, 'base64');

    var pathValue =  './controller/common/iamge/'+ ( +new Date() ) +'.png';

    fs.writeFile( pathValue, dataBuffer, function(err){
        if(err){
            res.json( returnFactory( -1, err ) );
        }else{
            res.json( returnFactory( 0, '上传成功' ) );
        }
    });
};

module.exports = controller;