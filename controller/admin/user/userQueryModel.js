
var UserQueryModel = {},
    UserDeleteService = tools.require( 'service/common/user/delete'),
    UserPatchService = tools.require( 'service/common/user/patch'),
    UserQueryService = tools.require( 'service/common/user/query' );

UserQueryModel.query = function( options, cbHandle ) {

    options = options || {};

    options.query = tools.filterEmpty( options.query );     // 过滤空参数
    options.sort = tools.filterEmpty( options.sort );
    options = tools.filterEmpty( options );

    UserQueryService( options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 删除
UserQueryModel.delete = function( id, cbHandle ) {
    UserDeleteService( id, function( err, data ) {
        cbHandle( err, data );
    });
};

// 冻结, 解冻
UserQueryModel.patchFreeze = function( id, options, cbHandle ) {

    options.isFreeze = ( options.isFreeze === 'false' ) ? false : true;
    UserPatchService( id, options, function( err, data ) {
        cbHandle( err, data );
    });
};

// 设置权限码
UserQueryModel.patchRole = function( id, options, cbHandle ) {
    options.role = JSON.parse( options.role );
    UserPatchService( id, options, function( err, data ) {
        cbHandle( err, data );
    });
};

module.exports = UserQueryModel;