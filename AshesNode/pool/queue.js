/**
 * Created by 00013712 on 2017/1/4.
 *
 * @method queue
 * @description 连接池队列管理, 添加, 获取, 删除, 清空
 *
 */

var queue = (function() {
    var list = [], addQueue, getQueue, removeQueue, clearQueue, getAllQueue;

    // 入栈
    addQueue = function( o ) {
        list.push( o );
    };

    getQueue = function() {
        return list.length && list.shift() || {};
    };

    // 干掉失效的连接
    removeQueue = function() {
        list.forEach(function( item, index ) {
            if ( !item.state ) {
                list.splice( index, 1 );
            }
        });
    };

    // 清理所有, 测试用
    clearQueue = function() {
        list = [];
    };

    // 获取队列
    getAllQueue = function() {
        return list;
    };

    return {
        add: addQueue,              // *
        get: getQueue,              // *
        remove: removeQueue,
        clear: clearQueue,
        getAll: getAllQueue         // *
    };
})();

module.exports = queue;
