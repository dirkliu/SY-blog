
var authority = require( './authoritys' );
module.exports = {
    100: {
        description: "普通用户级别",             // 用户说明
        authority: authority[100]               // 用户可访问的接口权限码
    },
    900: {
        description: "管理员级别",
        authority: authority[900]
    }
};

