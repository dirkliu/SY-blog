/**
 * @method collections.users
 * @description 注册入库, db集合规则
 */

// 用户注册
var collectionReg = {
    name: {
        remark: '用户名',
        type: 'String',
        required: true,
        maxLen: 20,
        validate: [
            { rules: /^[A-Za-z0-9]{4}/, text: '至少4个字符' },
            { rules: function( value ) {
                if ( value.substr( 0, 2 ) === 'sy' ) return true;
                return false;
            }, text: '前两个字符必须为sy' },
            { rules: /^[a-zA-Z][a-zA-Z0-9]*$/, text: '只能英文开头, 且不能有空格' }
        ]
    },
    password: {
        remark: '密码',
        type: 'String',
        required: true,
        maxLen: 32
    },
    email: {
        remark: '电子邮件',
        type: 'String',
        maxLen: 20,
        validate: {
            rules: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        }
    },
    level: {
        remark: '用户级别',
        type: 'Number',
        required: true
    },
    role: {
        remark: '用户权限',
        type: 'Array',
        required: true
    }
};

module.exports = collectionReg;