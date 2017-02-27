/**
 * Created by coofly on 2014/7/12.
 */
var io = require('socket.io')();
var xssEscape = require('xss-escape');

var nickname_list = [];
var nickname_o = {};

function HasNickname(_nickname) {
    for (var i = 0; i < nickname_list.length; i++) {
        if (nickname_list[i] == _nickname) {
            return true;
        }
    }
    return false;
}

function RemoveNickname(_nickname) {
    for (var i = 0; i < nickname_list.length; i++) {
        if (nickname_list[i] == _nickname)
            nickname_list.splice(i, 1);
    }
}

Array.prototype.unique2 = function(){
    this.sort(); //先排序
    var res = [this[0]];
    for(var i = 1; i < this.length; i++){
        if(this[i] !== res[res.length - 1]){
            res.push(this[i]);
        }
    }
    return res;
};

io.on('connection', function (_socket) {
    console.log(_socket.id + ': connection');
    _socket.emit('user_list', nickname_list);
    _socket.emit('need_nickname');
    _socket.emit('server_message', '欢迎来到聊天室~<br/>');

    _socket.on('disconnect', function () {
        console.log(_socket.id + ': disconnect');
        if (_socket.nickname != null && _socket.nickname != "") {
            _socket.broadcast.emit('user_quit', _socket.nickname);
            RemoveNickname(_socket.nickname);
        }
    });

    _socket.on('change_nickname', function (_nickname) {
        _nickname = xssEscape(_nickname.trim());
        console.log(_socket.id + ': change_nickname(' + _nickname + ')');
        var name_len = _nickname.replace(/[^\u0000-\u00ff]/g, "tt").length;
        if (name_len < 4 || name_len > 16) {
            return _socket.emit('change_nickname_error', '请填写正确的昵称，应为4到16个字符。');
        }

        if (_socket.nickname == _nickname) {
            return _socket.emit('change_nickname_error', '你本来就叫这个。');
        }

        if (HasNickname(_nickname)) {
            return _socket.emit('change_nickname_error', '此昵称已被人使用。');
        }

        var old_name = "";
        if (_socket.nickname != "" && _socket.nickname != null) {
            old_name = _socket.nickname;
            RemoveNickname(old_name);
        }

        nickname_list.push(_nickname);
        nickname_o[ _nickname ] = _socket.id;
        _socket.nickname = _nickname;

        console.log(nickname_list);

        _socket.emit('change_nickname_done', old_name, _nickname);
        if (old_name == "") {
            return _socket.broadcast.emit('user_join', _nickname)
        } else {
            return _socket.broadcast.emit('user_change_nickname', old_name, _nickname)
        }
    });

    _socket.on('say', function (_content) {
        if ("" == _socket.nickname || null == _socket.nickname) {
            return _socket.emit('need_nickname');
        }
        _content = _content.trim();
        console.log(_socket.nickname + ': say(' + _content + ')');
        _socket.broadcast.emit('user_say', _socket.nickname, xssEscape(_content));
        return _socket.emit('say_done', _socket.nickname, xssEscape(_content));
    });

    // 对某一个人说
    _socket.on('people_to', function ( nickname, _content) {
        console.log( "对", nickname, nickname_o[nickname], _content );
        console.log( "对", _socket.nickname,nickname_o[_socket.nickname], _content );
        _socket.broadcast.to( nickname_o[nickname] ).emit('people_to_say', _socket.nickname, xssEscape(_content));

        for( var i =0; i < nickname_list.length; i++ ) {
            if ( nickname_list[i] === _socket.nickname ) {
                _socket.emit('people_to_say', _socket.nickname, xssEscape(_content));
            }
        }
    });

});

exports.listen = function (_server) {
    return io.listen(_server);
};