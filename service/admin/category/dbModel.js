/**
 * Created by Administrator on 2017/1/8.

 * @method collections
 * @description db集合规则
 */

var collections = {};

// 分类表
collections.category = {
    cateName: {
        type: "String",
        required: true,
        maxLen: 20
    },
    parentId: {
        type: "String",
        required: true,
        maxLen: 24
    },
    desc: {
        type: "String",
        maxLen: 100
    }
};

module.exports = collections;