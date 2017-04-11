
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

    // 权限管理
    { route: '/admin/authority/api', method: 'get', authority: 10000, controller: '/admin/authority/api', routeName: '接口-管理' },
    { route: '/admin/authority/api/delete/:path', method: 'delete', authority: 90000, action: 'delete', controller: '/admin/authority/api', routeName: '接口-删除' },
    { route: '/admin/authority/api/patch/:path', method: 'patch', authority: 90000, action: 'patch', controller: '/admin/authority/api', routeName: '接口-更改' },

    // 用户管理{ 查看, 添加, 删除, 设置权限|冻结 }
    { route: '/admin/user/query', method: 'get', authority: 10000, controller: '/admin/user/query', routeName: '用户-查看' },
    { route: '/admin/user/delete/:ids', method: 'delete', authority: 90000, action: 'delete', controller: '/admin/user/user', routeName: '用户-删除' },
    { route: '/admin/user/patch/:ids', method: 'patch', authority: 90000, action: 'patch', controller: '/admin/user/user', routeName: '用户-权限|冻结' },

    // 分类信息
    { route: '/admin/category/query', method: 'get', authority: 10000, action: 'query', controller: '/admin/category/category', routeName: '分类-查询' },
    { route: '/admin/category/add', method: 'post', authority: 90000, action: 'save', controller: '/admin/category/category', routeName: '分类-添加' },
    { route: '/admin/category/delete', method: 'delete', authority: 90000, action: 'delete', controller: '/admin/category/category', routeName: '分类-删除' },

    // 文章管理
    { route: '/admin/article/query', method: 'get', authority: 10000, action: 'query', controller: '/admin/article/article', routeName: '文章-查询' },
    { route: '/admin/article/add', method: 'get', authority: 10000, action: 'add', controller: '/admin/article/article', routeName: '文章-渲染新增' },
    { route: '/admin/article/save', method: 'post', authority: 90000, action: 'save', controller: '/admin/article/article', routeName: '文章-保存' },
    { route: '/admin/article/patch/:ids', method: 'patch', authority: 90000, action: 'patch', controller: '/admin/article/article', routeName: '文章-局部更新' },
    { route: '/admin/article/delete/:ids', method: 'delete', authority: 90000, action: 'delete', controller: '/admin/article/article', routeName: '文章-删除' },
    { route: '/admin/article/put/:ids', method: 'put', authority: 90000, action: 'put', controller: '/admin/article/article', routeName: '文章-更新' },

    // 系统管理
    { route: '/admin/system/website', method: 'get', authority: 10000, controller: '/admin/system/website/index', routeName: '系统管理-查看' },
    { route: '/admin/system/website', method: 'post', authority: 90000, action: 'post', controller: '/admin/system/website/index', routeName: '系统管理-新增' },

    // 基本管理
    { route: '/admin/recommend', method: 'get', authority: 10000, controller: '/admin/base/recommend/index', routeName: '推荐项-查看' },
    { route: '/admin/recommend/patch/:ids', method: 'patch', authority: 90000, action: 'patch', controller: '/admin/base/recommend/index', routeName: '推荐项-修改' },
    { route: '/admin/history', method: 'get', authority: 10000, controller: '/admin/base/history/index', routeName: '浏览记录-查看' },
    { route: '/admin/link', method: 'get', authority: 10000, controller: '/admin/base/link/index', routeName: '友情链接-查看' },
    { route: '/admin/comment', method: 'get', authority: 10000, controller: '/admin/base/comment/index', routeName: '评论-查看' },

    // 标签管理
    { route: '/admin/tag', method: 'get', authority: 10000, controller: '/admin/base/tag/index', routeName: '标签-查看' },
    { route: '/admin/tag', method: 'post', authority: 90000, action: 'post', controller: '/admin/base/tag/index', routeName: '标签-新增' },
    { route: '/admin/tag/delete/:ids', method: 'delete', authority: 90000, action: 'delete', controller: '/admin/base/tag/index', routeName: '标签-删除' },
    { route: '/admin/tag/patch/:ids', method: 'patch', authority: 90000, action: 'patch', controller: '/admin/base/tag/index', routeName: '标签-修改' },

    // 登录
    { route: '/admin/login', method: 'get', controller: '/admin/login/login' },
    { route: '/admin/login', method: 'post', action: "submit", controller: '/admin/login/login' },

    // 默认页面
    { route: '/', method: 'get', controller: '/admin/login/login' },
    { route: '/admin', method: 'get', controller: '/admin/login/login' },

    // 注册
    { route: '/reg', method: 'get', controller: '/user/reg/reg' },
    { route: '/reg', method: 'post', action: 'register', controller: '/user/reg/reg' },

    // socket
    { route: '/socket', method: 'get', authority: 10000, controller: '/socket/index', routeName: '及时通信' },

    // 图片上传
    { route: '/upload', method: 'get', authority: 10000, controller: '/common/upload', routeName: '图片-上传' },
    { route: '/upload', method: 'post', authority: 90000, action: 'post', controller: '/common/upload', routeName: '图片-提交' },

    // 模拟权限接口{ 10000权限 }
    { route: '/cookie/add', method: 'get', controller: '/cookie/cookie' }
];

module.exports = routes;