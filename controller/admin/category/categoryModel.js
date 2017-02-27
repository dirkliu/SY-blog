
var Category,
    serviceCategory = tools.require( 'service/admin/category/category' );

Category = function( options ) {
    options = options || {};
    this.cateName = options.cateName;
    this.parentId = options.parentId;
    this.desc = options.desc;
    this.id = options.id;
};

Category.fn = Category.prototype;
Category.fn.constructor = Category;

// 读取分类信息
Category.query = function( id, cbHandle ) {

    if ( tools.isFunction( id ) ) {
        cbHandle = id;
        id = '0';
    } else {
        id = id || '0';
        cbHandle = cbHandle || function() {};
    }

    // 调用service接口
    serviceCategory.query( id, function( err, data ) {
        cbHandle( err, data );
    });
};

Category.fn.save = function( options, cbHandle ) {
    serviceCategory.save( options, function( err, data ) {
        cbHandle( err, data );
    });
};

Category.delete = function( id, cbHandle ) {
    serviceCategory.delete( id, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = Category;