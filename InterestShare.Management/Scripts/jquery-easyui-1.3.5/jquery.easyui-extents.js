/**
 * 使panel和datagrid在加载时提示
 * 
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 */
//$.fn.panel.defaults.loadingMessage = '加载中....';
//$.fn.datagrid.defaults.loadMsg = '加载中....';

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * panel关闭时回收内存，主要用于layout使用iframe嵌入网页时的内存泄漏问题
 */
$.fn.panel.defaults.onBeforeDestroy = function () {
    var frame = $('iframe', this);
    try {
        if (frame.length > 0) {
            for (var i = 0; i < frame.length; i++) {
                frame[i].src = '';
                frame[i].contentWindow.document.write('');
                frame[i].contentWindow.close();
            }
            frame.remove();
            if (navigator.userAgent.indexOf("MSIE") > 0) {// IE特有回收内存方法
                try {
                    CollectGarbage();
                } catch (e) {
                }
            }
        }
    } catch (e) {
    }
};

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 防止panel/window/dialog组件超出浏览器边界
 * @param left
 * @param top
 */
var easyuiPanelOnMove = function (left, top) {
    var l = left;
    var t = top;
    if (l < 1) {
        l = 1;
    }
    if (t < 1) {
        t = 1;
    }
    var width = parseInt($(this).parent().css('width')) + 14;
    var height = parseInt($(this).parent().css('height')) + 14;
    var right = l + width;
    var buttom = t + height;
    var browserWidth = $(window).width();
    var browserHeight = $(window).height();
    if (right > browserWidth) {
        l = browserWidth - width;
    }
    if (buttom > browserHeight) {
        t = browserHeight - height;
    }
    $(this).parent().css({/* 修正面板位置 */
        left: l,
        top: t
    });
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
$.fn.window.defaults.onMove = easyuiPanelOnMove;
$.fn.panel.defaults.onMove = easyuiPanelOnMove;

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 通用错误提示
 * 
 * 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作
 */
var easyuiErrorFunction = function (XMLHttpRequest) {
    parent.$.messager.progress('close');
    parent.$.messager.alert('错误', XMLHttpRequest.responseText, 'error');
};
$.fn.datagrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.treegrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.tree.defaults.onLoadError = easyuiErrorFunction;
$.fn.combogrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.combobox.defaults.onLoadError = easyuiErrorFunction;
$.fn.form.defaults.onLoadError = easyuiErrorFunction;

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 为datagrid、treegrid增加表头菜单，用于显示或隐藏列，注意：冻结列不在此菜单中
 */
var createGridHeaderContextMenu = function (e, field) {
    e.preventDefault();
    var grid = $(this);/* grid本身 */
    var headerContextMenu = this.headerContextMenu;/* grid上的列头菜单对象 */
    if (!headerContextMenu) {
        var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
        var fields = grid.datagrid('getColumnFields');
        for (var i = 0; i < fields.length; i++) {
            var fildOption = grid.datagrid('getColumnOption', fields[i]);
            if (!fildOption.hidden) {
                $('<div iconCls="icon-show" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            } else {
                $('<div iconCls="icon-hide" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            }
        }
        headerContextMenu = this.headerContextMenu = tmenu.menu({
            onClick: function (item) {
                var field = $(item.target).attr('field');
                if (item.iconCls == 'icon-show') {
                    grid.datagrid('hideColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-hide'
                    });
                } else {
                    grid.datagrid('showColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-show'
                    });
                }
            }
        });
    }
    headerContextMenu.menu('show', {
        left: e.pageX,
        top: e.pageY
    });
};
$.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
$.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;

/**
 * grid tooltip参数
 * 
 * @author 孙宇
 */
var gridTooltipOptions = {
    tooltip: function (jq, fields) {

        function bindEvent(jqs) {

            jqs.mouseover(function () {
                var content = $(this).text();
                if (content.replace(/(^\s*)|(\s*$)/g, '').length > 5) {
                    $(this).tooltip({
                        content: content,
                        trackMouse: true,
                        position: 'bottom',
                        onHide: function () {
                            $(this).tooltip('destroy');
                        },
                        onUpdate: function (p) {
                            var tip = $(this).tooltip('tip');
                            if (parseInt(tip.css('width')) > 500) {
                                tip.css('width', 500);
                            }
                        }
                    }).tooltip('show');
                }
            });
        }

        return jq.each(function () {
            var panel = $(this).datagrid('getPanel');
            if (fields && typeof fields == 'object' && fields.sort) {
                $.each(fields, function () {
                    var field = this;
                    bindEvent($('.datagrid-body td[field=' + field + '] .datagrid-cell', panel));
                });
            } else {
                bindEvent($(".datagrid-body .datagrid-cell", panel));
            }
        });

       
    }
};
/**
 * Datagrid扩展方法tooltip 基于Easyui 1.3.3，可用于Easyui1.3.3+
 * 
 * 简单实现，如需高级功能，可以自由修改
 * 
 * 使用说明:
 * 
 * 在easyui.min.js之后导入本js
 * 
 * 代码案例:
 * 
 * $("#dg").datagrid('tooltip'); 所有列
 * 
 * $("#dg").datagrid('tooltip',['productid','listprice']); 指定列
 * 
 * @author 夏悸
 */
$.extend($.fn.datagrid.methods, gridTooltipOptions);

/**
 * Treegrid扩展方法tooltip 基于Easyui 1.3.3，可用于Easyui1.3.3+
 * 
 * 简单实现，如需高级功能，可以自由修改
 * 
 * 使用说明:
 * 
 * 在easyui.min.js之后导入本js
 * 
 * 代码案例:
 * 
 * $("#dg").treegrid('tooltip'); 所有列
 * 
 * $("#dg").treegrid('tooltip',['productid','listprice']); 指定列
 * 
 * @author 夏悸
 */
$.extend($.fn.treegrid.methods, gridTooltipOptions);



// 编辑单元格
$.extend($.fn.datagrid.methods, {
    editCell: function (jq, param) {
        return jq.each(function () {
            var opts = $(this).datagrid('options');
            var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));
            for (var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor1 = col.editor;
                if (fields[i] != param.field) {
                    col.editor = null;
                }
            }
            $(this).datagrid('beginEdit', param.index);
            for (var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor = col.editor1;
            }
        });
    }
});



/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展validatebox，添加验证两次密码功能
 */
$.extend($.fn.validatebox.defaults.rules, {
    eqPwd: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的密码不一致！'
    }
});

/**
 * @author M.K
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展validatebox，添加正则表达式验证功能
 * 注意： \ 符号使用 # 符号来代替
 */
$.extend($.fn.validatebox.defaults.rules, {
    regExp: {
        validator: function (value, param) {
            var regexp = new RegExp(param[0].replaceAll('#', '\\'));
            return regexp.test(value);
        },
        message: '输入内容格式不正确！'
    }
});

/**
 * @author 夏悸
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展tree，使其可以获取实心节点
 */
$.extend($.fn.tree.methods, {
    getCheckedExt: function (jq) {// 获取checked节点(包括实心)
        var checked = $(jq).tree("getChecked");
        var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var node = $.extend({}, $.data(this, "tree-node"), {
                target: this
            });
            checked.push(node);
        });
        return checked;
    },
    getSolidExt: function (jq) {// 获取实心节点
        var checked = [];
        var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var node = $.extend({}, $.data(this, "tree-node"), {
                target: this
            });
            checked.push(node);
        });
        return checked;
    }
});

/**
 * @author 夏悸
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展tree，使其支持平滑数据格式
 */
$.fn.tree.defaults.loadFilter = function (data, parent) {
    var opt = $(this).data().tree.options;
    var idFiled, textFiled, parentField;
    if (opt.parentField) {
        idFiled = opt.idFiled || 'id';
        textFiled = opt.textFiled || 'text';
        parentField = opt.parentField;
        var i, l, treeData = [], tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i][idFiled]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
            if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
                if (!tmpMap[data[i][parentField]]['children'])
                    tmpMap[data[i][parentField]]['children'] = [];
                data[i]['text'] = data[i][textFiled];
                tmpMap[data[i][parentField]]['children'].push(data[i]);
            } else {
                data[i]['text'] = data[i][textFiled];
                treeData.push(data[i]);
            }
        }
        return treeData;
    }
    return data;
};

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展treegrid，使其支持平滑数据格式
 */
$.fn.treegrid.defaults.loadFilter = function (data, parentId) {
    var opt = $(this).data().treegrid.options;
    var idFiled, textFiled, parentField;
    if (opt.parentField) {
        idFiled = opt.idFiled || 'id';
        textFiled = opt.textFiled || 'text';
        parentField = opt.parentField;
        var i, l, treeData = [], tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i][idFiled]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
            if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
                if (!tmpMap[data[i][parentField]]['children'])
                    tmpMap[data[i][parentField]]['children'] = [];
                data[i]['text'] = data[i][textFiled];
                tmpMap[data[i][parentField]]['children'].push(data[i]);
            } else {
                data[i]['text'] = data[i][textFiled];
                treeData.push(data[i]);
            }
        }
        return treeData;
    }
    return data;
};

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展combotree，使其支持平滑数据格式
 */
$.fn.combotree.defaults.loadFilter = $.fn.tree.defaults.loadFilter;

/**
 * @author 孙宇
 * 
 * @requires jQuery,EasyUI
 * 
 * 创建一个模式化的dialog
 * 
 * @returns $.modalDialog.handler 这个handler代表弹出的dialog句柄
 * 
 * @returns $.modalDialog.xxx 这个xxx是可以自己定义名称，主要用在弹窗关闭时，刷新某些对象的操作，可以将xxx这个对象预定义好
 */
$.modalDialog = function (options) {
    if ($.modalDialog.handler == undefined) {// 避免重复弹出
        var opts = $.extend({
            iconCls: 'icon-dialog',
            title: '',
            width: 840,
            height: 680,
            modal: true,
            onClose: function () {
                $.modalDialog.handler = undefined;
                $(this).dialog('destroy');
                $.each($.modalDialog.disposeObjs, function (index, obj) {
                    obj.dialog('destroy');
                });
            }
        }, options);
        opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数

        opts.onBeforeOpen = function () {
            messager.progress.show();
            utils.executeFn(options.onBeforeOpen);
        }
        opts.onOpen = function () {
            messager.progress.hide();
            utils.executeFn(options.onOpen);
        }
        $.modalDialog.disposeObjs = [];
        return $.modalDialog.handler = $("<div style=\"overflow:hidden;\"/>").dialog(opts);
    }
};


$.modalWindow = function (options) {
    if ($.modalDialog.handler == undefined) {// 避免重复弹出
        var opts = $.extend({
            iconCls: 'icon-dialog',
            title: '',
            width: 840,
            height: 680,
            modal: true,
            onClose: function () {
                $.modalDialog.handler = undefined;
                $(this).dialog('destroy');
                $.each($.modalDialog.disposeObjs, function (index, obj) {
                    obj.dialog('destroy');
                });
            }
        }, options);
        opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数

        opts.onBeforeOpen = function () {
            messager.progress.show();
            utils.executeFn(options.onBeforeOpen);
        }
        opts.onOpen = function () {
            messager.progress.hide();
            utils.executeFn(options.onOpen);
        }
        $.modalDialog.disposeObjs = [];
        return $.modalDialog.handler = $("<div style=\"overflow:hidden;\"/>").window(opts);
    }
};


// 夏悸
$.extend($.fn.datagrid.defaults, {
    onLoadSuccess: function (data) {
        $.parser.parse('.grid-controls');
        $(this).datagrid('unselectAll').datagrid('uncheckAll');
        $(this).datagrid('clearSelections');

        if ((typeof data === 'object' && data.total == 0) || (typeof data === 'object' && data.sort && data.length == 0)) {
            var body = $(this).data().datagrid.dc.body2;
            body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 25px; text-align: center;">没有数据</td></tr>');
        }

        //$(this).datagrid('tooltip');

        if ($(this).data('tips')) {
            //$tips.info('操作成功！列表中数据已被重新加载！');
        } else {
            $(this).data('tips', 'M.K');
        }

    },
    pageList: [20, 30, 40, 50],
    pageSize: 20
});


$tips = {}
// 提示信息
$tips.info = function (msg) {
    parent.$.messager.show({
        title: '提示信息',
        width: 300,
        height: 140,
        msg: "<div class=\"messager-icon messager-info\"></div><div style=\"font-weight:bold;color:#339933;\">" +
            msg +
            "</div><div style=\"clear:both;\"></div>"
    });
}

// 提示信息
$tips.error = function (msg) {
    parent.$.messager.show({
        title: '错误信息',
        width: 300,
        height: 140,
        msg: "<div class=\"messager-icon messager-error\"></div><div style=\"font-weight:bold;color:#E51400;\">" +
            msg +
            "</div><div style=\"clear:both;\"></div>"
    });
}
