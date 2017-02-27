
module.exports = {
    100: {
        description: "普通用户级别",             // 用户说明
        authority: [ 10000, 10001, 10002 ]      // 用户可访问的接口权限码
    },
    200: {
        description: "会员级别",
        authority: [ 20000, 20001, 20000 ]
    },
    900: {
        description: "管理员级别",
        authority: [ 90000, 90001, 90000 ]
    }
};

