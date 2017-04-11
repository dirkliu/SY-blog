/**
 * Created by Administrator on 2017/1/8.
 *
 * @method fieldValidate
 * @description model验证模块
 *
 */

var fieldValidate = {};

/**
 * @method distribute
 * @description 规则分发, 扩展自定义属性, 添加自定义处理方式
 *
 *
 * @实例-扩展规则
 * @method rules
 * @description 正则验证内容
 *
 * @param {Object || Array} validate 正则内容
 * @param {String} ruleValue 被验证的内容
 * @param {String} fieldName 被验证的字段名
 * @param {String} remark 字段的备注
 *
 * @return {Object} { msg: tip }
 */

fieldValidate.distribute = {
    validate: function( validate, ruleValue, fieldName, remark ) {

        var returnMsg = {}, validateQueue = [];

        if ( tools.isObject( validate ) ) validateQueue.push( validate );
        if ( tools.isArray( validate ) ) validateQueue = validate;

        // 遍历执行验证规则
        validateQueue.forEach(function( item ) {
            var rules = item.rules,
                text = item.text || '格式不正确';

            if ( !rules ) return false;

            // function
            if ( tools.isFunction( rules ) ) {
                if ( !rules( ruleValue ) ) {
                    returnMsg.msg = remark + ':'+ text +'[' + ruleValue + ']';
                }
            }

            // 正则
            if ( tools.isRegExp( rules ) ) {
                if ( !rules.test( ruleValue ) ) {
                    returnMsg.msg = remark + ':'+ text +'[' + ruleValue + ']';
                }
            }

            return returnMsg.msg;
        });

        // 如果msg存有值, 则验证通不过
        if ( returnMsg.msg ) {
            return returnMsg;
        }

        return false;
    }
};

/**
 *
 * @method commonValidate
 * @description 验证字段类型, 长度, 是否必填
 * @param {String} fieldName 当前要验证的字段名
 * @param {Object} fieldAttr 当前要验证字段名的属性
 * @param {Object} options 所有的数据
 *
 * @return {Object} { msg: tip }
 */
fieldValidate.commonValidate = function( fieldName, fieldAttr, options ) {

    var oName = options[ fieldName ], result, fn,
        remark = fieldAttr.remark || fieldName;

    // 是否必填
    if ( fieldAttr.required && ( oName === undefined || oName === null ) ) {
        return {
            msg: remark + ':字段为必填'
        }
    }

    // 判断类型
    if ( oName && toString.call( oName ) !== '[object '+ fieldAttr.type +']' ) {
        return {
            msg: remark + ':字段类型必须为[' + fieldAttr.type + ']'
        }
    }

    // 判断长度
    if ( oName && fieldAttr.type === 'String' && oName.length > fieldAttr.maxLen ) {
        return {
            msg: remark + ':字段长度不能大于[' + fieldAttr.maxLen + ']'
        }
    }

    // 适配更多设置, 扩展分发
    for ( var i in fieldAttr ) {
        fn = fieldValidate.distribute[i];
        if ( tools.isFunction( fn ) ) {
            result = fn( fieldAttr[i], oName, fieldName, remark );
            if ( result ) {
                return result;
            }
        }
    }

    return false;
};


// 分类表数据验证
fieldValidate.category = function( options, collections ) {

    options = options || {};
    collections = collections || {};

    var result, category = collections, i;

    for ( i in category ) {
        result = fieldValidate.commonValidate( i, category[i], options );
        if ( result ) {
            result.code = -9997;
            return result;
        }
    }

    return false;
};

module.exports = fieldValidate;