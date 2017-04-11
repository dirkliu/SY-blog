/**
 * @method collections.Article
 * @description 添加文章入库, db集合规则
 */

var collectionArticle = {
    title: {
        remark: '文章标题', type: 'String', maxLen: 100, required: true,
        validate: [
            { rules: function( value ) {
                if ( value.length > 4 ) return true;
                return false;
            }, text: '至少4个字符' }
        ]
    },
    categoryId: { remark: '文章分类', type: 'String', maxLen: 32, required: true },
    author: { remark: '作者', type: 'String', maxLen: 10, required: true },
    source: { remark: '来源', type: 'String', maxLen: 20, required: true },
    like: { remark: '喜欢次数', type: 'Number', maxLen: 10 },
    read: { remark: '阅读次数', type: 'Number', maxLen: 10 },
    tag: { remark: '标签', type: 'Array' },
    recommendLevel: { remark: '推荐位置', type: 'Number', maxLen: 1 },
    isComment: { remark: '评论权限', type: 'Number', maxLen: 1 },
    isRead: { remark: '阅读权限', type: 'Number', maxLen: 1 },
    keyWord: { remark: '关键词', type: 'String', maxLen: 100 },
    desc: { remark: '描述', type: 'String', maxLen: 100 },
    content: { remark: '内容', type: 'String' },
    createTime: { remark: '文章创建时间', type: 'String', maxLen: 23 },
    updateTime: { remark: '文章更新时间', type: 'String', maxLen: 23, default: '' }
};

module.exports = collectionArticle;