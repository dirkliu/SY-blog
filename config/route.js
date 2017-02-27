
/*{
    route: "/newIndex",                 // api
    method: [ "get", "post" ],          // 请求方法
    authority: 10000,                   // 接口权限的级别
    controller: "/index/index",         // 指向的控制器文件
    action: "index",                    // 调用指定的方法( 默认是init )
    extendMiddleware: {
        action: "middleInsert",         // 添加自定义中间件函数, 排序级别在倒数第二
        controller: "/index/index"      // 指向的控制器文件
}
}*/

var routes = [
    { route: '/socket', method: "get", controller: '/socket/index' },

    // 分类信息
    { route: '/admin/category/query', method: "get", action: 'query', controller: '/admin/category/category' },
    { route: '/admin/category/add', method: "post", authority: 10000, action: 'save', controller: '/admin/category/category' },
    { route: '/admin/category/delete', method: "delete", authority: 90000, action: 'delete', controller: '/admin/category/category' },

    // 登录
    { route: '/admin/login', method: "get", controller: '/admin/login/login' },
    { route: '/admin/login', method: "post", action: "submit", controller: '/admin/login/login' },

    // 注册
    { route: '/reg', method: "get", controller: '/user/reg/reg' },
    { route: '/reg', method: "post", action: 'register', controller: '/user/reg/reg' }
];

module.exports = routes;