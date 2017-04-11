
var Model = {},
    tagService = tools.require( 'service/admin/tag/tagModel' );

Model.query = function( options, cbHandle ) {
    tagService.query( options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 新增tag
Model.add = function( options, cbHandle ) {
    tagService.save( options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 更新tag
Model.patch = function( id, options, cbHandle ) {
    tagService.patch( id, options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 删除tag
Model.delete = function( id, cbHandle ) {
    tagService.delete( id, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = Model;