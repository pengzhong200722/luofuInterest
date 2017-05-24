/*
对easyui datagrid控件包装
selector：元素选择器
options：datagrid options
created by：zhujiayi
*/
var DataGrid = function (selector, options) {
    var that = this;
    var $dataGrid = $(selector);
    /*
    私有函数，初始化datagrid
    */
    function __initDataGrid(options) {
        options.method = options.method || "GET";
        options.idField = options.idField || "ID";
        options.fit = true;
        options.fitColumns = true;
        options.singleSelect = options.singleSelect == undefined ? false : options.singleSelect;
        options.rownumbers = true;
        options.nowrap = false;
        options.pagination = options.pagination == undefined ? true : options.pagination;
        options.pageSize = 20;
        options.pageList = [10, 20, 30, 40, 50];
        options.columns = [options.columns];
        options.queryParams = options.queryParams || {};
        options.loadFilter = options.loadFilter || function (data) {
            if (data.isSuccess === false) {
                messager.error("错误", data.message);
                return null;
            }

            return data;
        };

        return $dataGrid.datagrid(options);
    }

    /*
    对easyui初始化datagrid做一层封装
    2个参数，selector 是作为初始化基础元素的选择器,options 是datagrid的配置,参数名保持不变
    datagrid 获取数据推荐使用get
    idField主键列如果不传默认为ID，区分大小写！
    响应的json数据格式有特殊要求，请查看 Pagination 泛型类；如果不想用这个类型，则需要自行编写loadFilter事件代码，进行错误处理等操作
    */
    this.init = function (options) {
        if (!options) {
            //console.log("options 参数为必传参数");
            messager.warning("初始化错误", "options 参数为必传参数");
            return;
        }

        if (!options.url) {
            messager.warning("初始化错误", "请传入正确的url");
            return;
        }

        if (!options.columns) {
            messager.warning("初始化错误", "请传入正确的columns");
            return;
        }

        __initDataGrid(options);
        return that;
    }
    //清除datagrid选中的行和选中的checkbox
    this.clearSelections = function () {
        $dataGrid.datagrid('clearSelections').datagrid('clearChecked');
        return that;
    }
    //重新加载datagrid
    this.reload = function () {
        $dataGrid.datagrid("reload").datagrid('clearSelections').datagrid('clearChecked');
        return that;
    },
    //修改参数重新查询 param 键值对
    this.load = function (param) {
        if (param) {
            $dataGrid.datagrid("load", param || {});
        }

        return that;
    }
    //获取选中的行
    this.getCheckedRow = function () {
        var rows = $dataGrid.datagrid("getChecked");
        if (!rows || rows.length == 0) {
            messager.warning("提示", "请选择需要操作的数据");
            return;
        }

        if (rows.length > 1) {
            messager.error("错误", "一次只能操作一条数据！");
            this.clear();
            return;
        }

        return rows[0];
    }
    //获取选中的所有行
    this.getCheckedRows = function () {
        var rows = $dataGrid.datagrid("getChecked");
        if (!rows || rows.length == 0) {
            messager.warning("提示", "请选择需要操作的数据");
            return;
        }

        return rows;
    },
    //根据id选中一行
    this.selectRecord = function (id) {
        if (!id) {
            return;
        }

        $dataGrid.datagrid("selectRecord", id);
        return that;
    }

    //根据索引选中一行
    this.selectRow = function (index) {
        $dataGrid.datagrid("selectRow", index);
    }

    if (options) {
        this.init(options);
    }

    return this;
};

/*
消息框
*/
window.messager = {
    info: function (title, msg, fn) {
        parent.$.messager.alert(title, msg, "info", fn);
    },
    warning: function (title, msg, fn) {
        parent.$.messager.alert(title, msg, "warning", fn);
    },
    error: function (title, msg, fn) {
        parent.$.messager.alert(title, msg, "error", fn);
    },
    question: function (title, msg, fn) {
        parent.$.messager.alert(title, msg, "question", fn);
    },
    confirm: function (title, msg, fn) {
        parent.$.messager.confirm(title, msg, function (r) {
            if (r) {
                utils.executeFn(fn);
            }
        });
    },
    progress: {
        show: function () {
            parent.$.messager.progress({
                title: '提示',
                text: '数据处理中，请稍后...'
            });
        },
        hide: function () {
            parent.$.messager.progress('close');
        }
    }
};

window.utils = {
    executeFn: function (fn) {
        if (fn && typeof fn === "function") {
            var arr = Array.prototype.slice.call(arguments, 1)
            fn.apply(this, arr);
        }
    },
    //将form包装为异步提交
    wrapForm: function (element, url, callbackFn) {
        var $form;
        if (typeof element == "string") {
            $form = $(element);
        }
        else {
            $form = element;
        }

        $form.form({
            url: url,
            onSubmit: function () {
                messager.progress.show();
                var isValid = $form.form('validate');
                if (!isValid) {
                    messager.progress.hide();
                }

                return isValid;
            },
            success: function (responseJson) {
                var response = eval("(" + responseJson + ")");
                messager.progress.hide();
                if (response.isSuccess) {
                    modalDialog.close();
                    utils.executeFn(callbackFn, response)
                } else {
                    messager.error("错误", response.message);
                }
            }
        });
    }
};

window.modalDialog = {
    close: function () {
        parent.$.modalDialog.handler.dialog('close');
    }
};

$(function () {
    //在所有类为ChoseArea的input标签上绑定事件
    $('input[class*="Util_ChoseArea"]').live('click', function () {
        var ob = this;
        //InitAreaControl();

        if ($("#ChoseAreaID").length == 0) {
            $('input[class*="Util_ChoseArea"]').after("<input type='hidden' id='ChoseAreaPath'/><input type='hidden' id='ChoseAreaID' name=@ctrName />")
        }

        var currentDG = $.dialog({
            title: '选择所属区域',
            zIndex:100000,
            min: false,
            max: false,
            drag:true,
            fixed: true,
            lock: true,
            width: '332px',
            height: '310px',
            content: 'url:/Area/ChoseArea',
            ok: function () {

                var areaJson = currentDG.content.areaJson;
                var areaID = areaJson.Continent.ID + '-' + areaJson.Country.ID + '-' + areaJson.City.ID;
                var areaName = areaJson.Continent.Name + '-' + areaJson.Country.Name + '-' + areaJson.City.Name;

                $(ob).val(areaName);
                $("#ChoseAreaPath").val(areaID);
                $("#ChoseAreaID").val(areaJson.City.ID);

            },
            cancelVal: '关闭',
            cancel: true,
            data: $("#ChoseAreaPath").val()
        });

    });

});
