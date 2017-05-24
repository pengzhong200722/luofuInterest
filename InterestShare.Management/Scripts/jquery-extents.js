/**
 * Create a cookie with the given key and value and other optional parameters.
 * 
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain used when the cookie was set.
 * 
 * @param String
 *            key The key of the cookie.
 * @param String
 *            value The value of the cookie.
 * @param Object
 *            options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
 * @type undefined
 * 
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 * 
 * Get the value of a cookie with the given key.
 * 
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 * 
 * @param String
 *            key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 * 
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.cookie = function (key, value, options) {
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = $.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    options = value || {};
    var result, decode = options.raw ? function (s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/**
 * @author 孙宇
 * 
 * @requires jQuery
 * 
 * 将form表单元素的值序列化成对象
 * 
 * @returns object
 */
$.serializeObject = function (form) {
    var o = {};
    $.each(form.serializeArray(), function (index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
};

/*
* 停止事件冒泡
*/
$.stopPropagation = function (event) {
    if (event && event.stopPropagation)
        event.stopPropagation();
    else
        window.event.cancelBubble = true;
}
/**
 * @author 孙宇
 * 
 * 增加formatString功能
 * 
 * 使用方法：$.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 * 
 * @returns 格式化后的字符串
 */
$.formatString = function (str) {
    for (var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};

/**
 * @author 孙宇
 * 
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 * 
 * @returns list
 */
$.stringToList = function (value) {
    if (value != undefined && value != '') {
        var values = [];
        var t = value.split(',');
        for (var i = 0; i < t.length; i++) {
            values.push('' + t[i]);/* 避免他将ID当成数字 */
        }
        return values;
    } else {
        return [];
    }
};

/**
 * @author 孙宇
 * 
 * @requires jQuery
 * 
 * 改变jQuery的AJAX默认属性和方法
 */
$.ajaxSetup({
    type: 'POST',
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        try {
            parent.$.messager.progress('close');
            parent.$.messager.alert('错误', XMLHttpRequest.responseText);
        } catch (e) {
            alert(XMLHttpRequest.responseText);
        }
    }
});

/**
 * @author 孙宇
 * 
 * 去字符串空格
 * 
 * @returns
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, '');
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, '');
};

/**
 * 格式化时间
 * 
 * @param format
 * @returns
 */
Date.prototype.format = function (format) {
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+": this.getMonth() + 1,
        // month
        "d+": this.getDate(),
        // day
        "h+": this.getHours(),
        // hour
        "m+": this.getMinutes(),
        // minute
        "s+": this.getSeconds(),
        // second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        // quarter
        "S": this.getMilliseconds()
        // millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 * 去除字符串左右空格
 */
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

/**
 * 获取url的get参数
 * 
 * @param param
 *            要获取的参数名称，如果不传，则返回整个参数对象
 * @returns
 */
String.prototype.URLParams = function (param) {
    var params = {};
    var href = /^http/i.test(this) ? this : window.location.toString();
    var uri = href.split("?");
    if (!uri[1])
        return null;

    uri = uri[1].split("#")[0];

    var paramSet = uri.split("&");
    var temp = [];
    for (index in paramSet) {
        temp = paramSet[index].split("=");
        params[temp[0]] = temp[1];
    }

    if (param) {
        if (params[param])
            return params[param];
        else
            return null;
    } else {
        return params;
    }
};
/**
 * 字符串模版替换
 * 
 * @param this
 *            需要替换的字符串，例如：我是{{key1}}替换的字符串{{key2}}。
 * @param data
 *            替换的数据。json格式的数据或者数组。 eg： str：我是{{key1}}替换的字符串{{key2}}。
 *            data：{key1:"替换",key2:"替换2"}
 * 
 * str：我是{{0}}替换的字符串{{1}}。 data：["替换","替换2"]
 * @returns
 */
String.prototype.template = function (data) {
    var str = this;
    for (var key in data) {
        var value = data[key];
        if (value === null)
            value = "&nbsp;";
        str = str.replace(new RegExp("{{" + key + "}}", "gm"), value);
    }
    return str;
};
/**
 * 字符串替换所有匹配元素
 * 
 * @param old
 *            原元素
 * @param news
 *            替换元素
 * @returns
 */
String.prototype.replaceAll = function (old, news) {
    return this.replace(new RegExp(old, "gm"), news);
};

/*
 * 动态构建一个Form 并且提交
*/
$.dynamicSubmit = function (url, datas) {

    var form = $('#dynamicForm');

    if (form.length <= 0) {
        form = $("<form>");
        form.attr('id', 'dynamicForm');
        form.attr('style', 'display:none');
        form.attr('target', '');
        form.attr('method', 'post');

        $('body').append(form);
    }

    form = $('#dynamicForm');
    form.attr('action', url);
    form.empty();

    if (datas && typeof (datas) == 'object') {
        for (var item in datas) {
            var $_input = $('<input>');
            $_input.attr('type', 'hidden');
            $_input.attr('name', item);
            $_input.val(datas[item]);

            $_input.appendTo(form);
        }
    }

    form.submit();
}


/*
*   以JSON的ContentType方式提交
*/
$.postJson = function (url, data, callback) {
    $.ajax({
        url: url,
        data: $.toJSON(data),
        cache: false,
        processData: false,
        type: 'POST',
        contentType: 'application/json',
        success: callback
    });
}