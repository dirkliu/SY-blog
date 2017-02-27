
var storageSignToken = require( "./storageSignToken" ),         // sign, token存储
    generateToken = require( "./initialize" ),                  // 创建和验证token
    createSign, signAdapter;

/**
 * @method signAdapter
 * @description 分发处理签名, 可用多种方式签名, 默认是客户端签名[ client ], 生成md5签名
 */
signAdapter = {
    type: {
        client: "client",
        other: "other"
    },
    create: function( options ) {
        return tools.md5( options );
    },

    // 根据客户端信息生成
    client: function( payload, req ) {
        var clientIp = req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
            ip = clientIp.slice( 7 ),
            userAgent = req.headers[ 'user-agent' ];

        payload.ip = ip;
        payload.userAgent = userAgent;
        payload.type = 'client';

        return {
            payload: payload,
            sign: this.create({
                time: tools.day.timeStamp(),
                id: tools.mathId(),
                ip: ip,
                userAgent: userAgent
            })
        }
    }
};

/**
 * method generateSign
 * @description 生成签名串, 根据payload生成token, 返回给前端引用token
 *
 * @param {Object} opt 一些标识, token内容, http req
 * @param {Function} cbHandle 生成Token的回调
 */
createSign = function( opt, cbHandle ) {
    var type = opt.type || "client",
        result,
        payload = opt.payload || {},
        signHandle = signAdapter[ type ];

    // 签名加密
    if ( !tools.isFunction( signHandle ) ) return;
    result = signHandle.call( signAdapter, payload, opt.req );

    // 生成token
    generateToken.create( result.payload, function( dataToken ) {

        // 存储格式{ sign: token }
        storageSignToken.add( result.sign, dataToken );
        cbHandle( result.sign );
    });
};

module.exports = {
    create: createSign
};

/*
demo
generateSign.create({
    payload: {
        id: user._id
    },
    req: req
}, function( data ) {
    res.json({
        code: 0,
        data: {
            sign: data
        }
    });
});
*/