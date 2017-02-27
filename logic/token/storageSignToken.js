/**
 * @method storage
 * @description 存储token和sign的对应关系
 *
 * @method {Object} collection 存储于对象中, 一个token对应一个签名串
 * @method add 新增一个对应关系, 如果有相同的sign, 则会覆盖
 * @method delete 删除对应关闭( 一般用于token过期 )
 * @method query 查询一个对应关系 用于验证token
 */

var storage = {
    collection: {
        "签名串": "token"
    },
    add: function( sign, token ) {
        if ( !sign || !token ) return;
        this.collection[ sign ] = token;
    },
    delete: function( sign ) {
        if ( sign ) return delete this.collection[ sign ];
        return this.collection = {};
    },
    query: function( sign ) {
        if ( sign ) return this.collection[ sign ];
        return this.collection;
    }
};

module.exports = {
    add: storage.add.bind( storage ),
    query: storage.query.bind( storage ),
    delete: storage.delete.bind( storage )
};