var easyuiDateTimeHandler = function (value, row, index) {
    var da = new Date(parseInt(value.replace("/Date(", "").replace(")/", "").split("+")[0]));
    return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-"
        + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
}


function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function myparser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}


function easyuiActionHtmlCreator_modify_remove(id, modifyfuncname, removefuncname) {
    var html;
    var modifyFuncHtml;
    var removeFuncHtml;
    modifyFuncHtml = "" + modifyfuncname + "('" + id + "');";
    removeFuncHtml = "" + removefuncname + "('" + id + "');";
    html = "<div class=\"grid-controls\"> <a href=\"javascript:void(0)\" class=\"easyui-menubutton\" data-options=\"menu:'#mm" + id + "',iconCls:'icon-edit-down'\">操作</a><div id=\"mm" + id + "\" style=\"width:100px;\">   <div onclick=\"" + modifyFuncHtml + "\" data-options=\"iconCls:'icon-edit'\">修改</div>                      <div onclick=\"" + removeFuncHtml + "\" data-options=\"iconCls:'icon-remove'\">删除</div>                     </div></div>";
    return html;
}


function easyuiActionHtmlCreator_storage(id, modifyfuncname) {
    var html;
    var modifyFuncHtml;
    var removeFuncHtml;
    modifyFuncHtml = "" + modifyfuncname + "('" + id + "');";
    html = "<div class=\"grid-controls\"> <a href=\"javascript:void(0)\" class=\"easyui-menubutton\" data-options=\"menu:'#mm" + id + "',iconCls:'icon-edit-down'\">操作</a><div id=\"mm" + id + "\" style=\"width:100px;\">   <div onclick=\"" + modifyFuncHtml + "\" data-options=\"iconCls:'icon-edit'\">出库入库</div></div></div>";
    return html;
}

