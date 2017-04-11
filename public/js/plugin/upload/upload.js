(function( o ) {

    var _this = o();
    if ( typeof exports === "object" ) {
        module.exports = _this;
    } else if ( typeof define === "function" && define.amd ) {
        define( [], function() {
            return _this;
        });
    } else {
        window[ "Upload" ] = _this;
    }
})(function() {

    var _toString = Object.prototype.toString, guId = 0,
        upload = {},
        helper = {
            ruleExe: function( value, model ) {
                if ( model.required && !value ) {
                    return {
                        code: false,
                        msg: model.remark + "为: [必填]"
                    }
                }
                if ( value ) {
                    return {
                        code: _toString.call( value ) === "[object "+ model.type +"]",
                        msg: model.remark + "必须为: " + model.type + " [" + value.valueOf() + "]"
                    }
                }
            }
        },
        ruleModel = {
            url: { remark: "上传URL", type: "String", required: true },
            imageType: { remark: "文件类型", type: "Array" },
            compress: { remark: "压缩配置", type: "Object" },
            readerStart: { remark: "读取开始函数", type: "Function" },
            readerProgress: { remark: "读取进度函数", type: "Function" },
            readerSuccess: { remark: "读取成功函数", type: "Function" },
            uploadProgress: { remark: "上传进度函数", type: "Function" },
            uploadSuccess: { remark: "上传成功函数", type: "Function" }
        },
        errorTip = {
            0: "上传失败",
            1: "读取文件失败",
            2: "文件大小无效",
            3: "文件类型错误, 只允许",
            100: "文件不能超过",
            400: "文件正在上传, 请稍后操作"
        };

    helper.setDefault = function() {
        var options = this.options;

        errorTip["3"] = errorTip["3"] + options.imageType.toString();
        errorTip["100"] = errorTip["100"] + Math.round( options.maxSize / 1024 / 1024 ) + "M";
    };

    // 验证
    helper.validate = function() {
        var options = this.options, i, result;

        for ( i in options ) {
            if ( i in ruleModel ) {
                result = helper.ruleExe( options[i], ruleModel[i] );
                if ( result && !result.code ) {
                    break;
                }
                result = null;
            }
        }
        return result;
    };

    // 实例化一个上传对象
    upload.init = function( element, options ) {

        var validateResult;
        options = options || {};
        this.el = document.querySelector( element );
        this.options = {
            url: options.url,
            maxSize: ( options.maxSize || 8 ) * 1024 * 1000,    // 默认上限8M
            imageType: [ "image/jpeg", "image/png" ],           // 指定的文件类型
            compress: {
                ratio: options.ratio || 1,                      // 压缩比例
                sizePx: options.sizePx || 2000000               // 设置压缩尺寸
            },

            readerStart: options.readerStart,                   // 读取开始
            readerProgress: options.readerProgress,             // 读取进度
            readerSuccess: options.readerSuccess,               // 读取完毕
            uploadProgress: options.uploadProgress,             // 上传进度
            uploadSuccess: options.uploadSuccess                // 上传完成
        };

        validateResult = helper.validate.call( this );
        if ( validateResult ) {
            return alert( validateResult.msg );
        }
        helper.setDefault.call( this );
        this.bindEvent();
    };

    upload.init.prototype = {
        constructor: upload.init,
        handleEvent: function( e ) {
            switch( e.type ) {
                case "change":
                    this.change( e );
                    break;
            }
        },
        bindEvent: function() {
            this.el.addEventListener( "change", this, false );
        },
        change: function( e ) {
            var files = e.target.files,
                options = this.options;

            for ( var i = 0, l = files.length; i < l; i++ ) {

                if ( files[i].size <= 0 ) {
                    return this.onError( errorTip["2"], null );
                }
                if ( files[i].size > this.options.maxSize ) {
                    return this.onError( errorTip["100"], null );
                }
                if ( options.imageType.indexOf( files[i].type ) < 0 ) {
                    return this.onError( errorTip["3"], null );
                }

                guId++;
                this.reader( files[i] );
            }
        },
        reader: function( file ) {
            var self = this;
            new ReaderFile( file, {
                start: this.options.readerStart,
                progress: this.options.readerProgress,
                success: function( base64 ) {
                    self.options.readerSuccess( base64 );
                    self.loadImage( base64 );
                },
                error: this.onError
            });
        },
        loadImage: function( url ) {
            var self = this;
            LoadImage.load( url, function( imgStr, state ) {
                if ( state > 0 ) {
                    self.compress( imgStr );
                }
            });
        },
        compress: function( img ) {
            var self = this,
                config = this.options.compress;

            new Compress( img, {
                ratio: config.ratio,
                sizePx: config.sizePx,
                success: function( data ) {
                    self.send( data );
                }
            });
        },
        send: function( base64Str, params ) {

            var self = this, url,
                options = self.options,
                data = {
                    base64Str: base64Str
                };

            url = options.url;

            $.ajax({
                url: url,
                type: 'post',
                data: data,
                beforeSend: function( xhr ) {

                    var progressHandle = function( event ) {
                        var loaded = event.loaded || -1,
                            total = event.total || 0;

                        if ( event.lengthComputable ) {
                            options.uploadProgress({
                                total: total / 1024 | 0,
                                progress: loaded / total * 100 | 0
                            });
                        }

                        // 取消监听进度条
                        if ( loaded >= total ) {
                            xhr.upload.removeEventListener( "progress", progressHandle );
                        }
                    };

                    xhr.upload.addEventListener( "progress", progressHandle );
                },
                success: function( data ) {
                    options.uploadSuccess( data );
                },
                error: function( data ) {
                    self.onError( data, "network" );
                }
            });
        },

        /**
         * @method onError
         * @param {String} msg 错误消息
         * @param {String} type 错误来源
         */
        onError: function( msg, type ) {},
        destroy: function() {
            var options = this.options, i,
                el = this.el;

            el.removeEventListener( "change", this );
            el = null;

            for ( i in options ) options[i] = null;
            options = null;
        }
    };

    return upload;

});