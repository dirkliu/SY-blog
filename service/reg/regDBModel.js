/**
 * @method collections.users
 * @description 注册入库, db集合规则
 */

// 用户注册
var collectionReg = {
    name: {
        remark: '用户名', type: 'String', required: true, maxLen: 20,
        validate: [
            { rules: function( value ) {
                if ( value.length < 4 ) return false;
                return true;
            }, text: '至少4个字符' }
        ]
    },
    password: { remark: '密码', type: 'String', required: true, maxLen: 32 },
    email: {
        remark: '电子邮件', type: 'String', maxLen: 20,
        validate: {
            rules: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        }
    },
    ip: { remark: 'ip', type: 'String', maxLen: 20 },
    createTime: { remark: '注册时间', type: 'String', maxLen: 23 },
    level: { remark: '用户级别', type: 'Number', required: true },
    role: { remark: '用户权限', type: 'Array', required: true },
    isFreeze: { remark: '是否冻结用户', type: 'Boolean', default: false }
};

module.exports = collectionReg;