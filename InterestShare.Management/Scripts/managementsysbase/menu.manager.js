(function() {
  var treeGrid, treeGridColumns;

  treeGrid = null;

  $(function() {
    return treeGrid = $('#treeGrid').treegrid({
      url: $treeGridUrl,
      idField: 'Id',
      treeField: 'Name',
      rownumbers: true,
      fit: true,
      fitColumns: false,
      border: false,
      columns: [treeGridColumns],
      toolbar: '#toolbar',
      onDblClickRow: function(rowIndex, rowData) {
        return modifySelectRow();
      },
      onContextMenu: function(e, row) {
        e.preventDefault();
        $(this).treegrid('unselectAll');
        $(this).treegrid('select', row.Id);
        return $('#menu').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      },
      onBeforeLoad: function() {
        return parent.$.messager.progress({
          title: '提示',
          text: '数据处理中，请稍后...'
        });
      },
      onLoadSuccess: function() {
        $.parser.parse('.grid-controls');
        return parent.$.messager.progress('close');
      }
    });
  });

  treeGridColumns = [
    {
        field: 'Action',
        title: '操作',
        width: 120,
        formatter: function (value, row, index) {
            var html, modifyFuncHtml, removeFuncHtml;
            modifyFuncHtml = row.GroupId === "0" ? "modifyMenuGroup('" + row.Id + "');" : "modifyMenu('" + row.Id + "');";
            removeFuncHtml = row.GroupId === "0" ? "removeMenuGroup('" + row.Id + "');" : "removeMenu('" + row.Id + "');";
            html = "<div class=\"grid-controls\"> <a href=\"javascript:void(0)\" class=\"easyui-menubutton\" data-options=\"menu:'#mm" + row.Id + "',iconCls:'ico-edit-down'\">编辑</a> <div id=\"mm" + row.Id + "\" style=\"width:100px;\"> <div onclick=\"" + modifyFuncHtml + "\" data-options=\"iconCls:'ico-edit'\">修改</div> <div onclick=\"" + removeFuncHtml + "\" data-options=\"iconCls:'ico-remove'\">删除</div> </div> </div>";
            return html;
        }
    },{
      field: 'Id',
      title: '菜单ID',
      width: 250,
      hidden: true
    }, {
      field: 'GroupId',
      title: '组别ID',
      width: 250,
      hidden: true
    }, {
      field: 'Name',
      title: '菜单或组别名称',
      width: 200
    }, {
      field: 'Url',
      title: '菜单地址',
      width: 200
    }, {
      field: 'Order',
      title: '菜单排序',
      width: 140
    }, {
        field: 'CreatedDate',
        title: '创建日期',
        width: 180,
        formatter: function (value, row, index) {
            var da = new Date(parseInt(value.replace("/Date(", "").replace(")/", "").split("+")[0]));
            return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-"
                + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + " "
                + (da.getHours() < 10 ? "0" + da.getHours() : da.getHours()) + ":"
                + (da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds());
        }
    }, {
      field: 'Note',
      title: '备注信息',
      width: 200
    }
  ];

  this.refreshGrid = function() {
    return treeGrid.treegrid('reload');
  };

  this.modifySelectRow = function() {
    var row;
    row = treeGrid.treegrid('getSelected');
    if (row == null) {
      return;
    }
    if (row.GroupId === "0") {
      return modifyMenuGroup(row.Id);
    } else {
      return modifyMenu(row.Id);
    }
  };

  this.removeSelectRow = function() {
    var row;
    row = treeGrid.treegrid('getSelected');
    if (row == null) {
      return;
    }
    if (row.GroupId === "0") {
      return removeMenuGroup(row.Id);
    } else {
      return removeMenu(row.Id);
    }
  };

  this.addMenu = function() {
    var groupId, row;
    row = treeGrid.treegrid('getSelected');
    groupId = row ? row.GroupId : '';
    parent.$.modalDialog.openner_treeGrid = treeGrid;
    return parent.$.modalDialog({
      title: '添加菜单',
      width: 670,
      height: 370,
      href: $addMenuViewUrl + ("?groupId=" + groupId),
      buttons: [
        {
          text: '确定',
          iconCls: 'ico-save',
          handler: function() {
            var frm;
            frm = parent.$.modalDialog.handler.find('#form');
            if (frm) {
              return frm.submit();
            }
          }
        }, {
          text: '取消',
          iconCls: 'ico-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

  this.modifyMenu = function(menuId) {
    var row;
    if (menuId != null) {
      treeGrid.treegrid('select', menuId);
    }
    row = treeGrid.treegrid('getSelected');
    parent.$.modalDialog.openner_treeGrid = treeGrid;
    if (row) {
      return parent.$.modalDialog({
        title: "修改菜单 - " + row.Name,
        width: 670,
        height: 370,
        href: $modifyMenuViewUrl + ("?menuId=" + row.Id),
        buttons: [
          {
            text: '确定',
            iconCls: 'ico-save',
            handler: function() {
              var frm;
              frm = parent.$.modalDialog.handler.find('#form');
              if (frm) {
                return frm.submit();
              }
            }
          }, {
            text: '取消',
            iconCls: 'ico-cancel',
            handler: function() {
              return parent.$.modalDialog.handler.dialog('close');
            }
          }
        ]
      });
    }
  };

  this.removeMenu = function(menuId) {
    var row;
    if (menuId != null) {
      treeGrid.treegrid('select', menuId);
    }
    row = treeGrid.treegrid('getSelected');
    if (row) {
      return parent.$.messager.confirm('询问', "您确定要删除当前选中的 [" + row.Name + "] 菜单吗？", function(r) {
        if (!r) {
          return;
        }
        parent.$.messager.progress({
          title: '提示',
          text: '数据处理中，请稍后...'
        });
        return $.post($removeMenuUrl, {
          menuId: row.Id
        }, function(data) {
          parent.$.messager.progress('close');
          if (data.isSuccess) {
            treeGrid.treegrid('reload');
            return parent.refreshMenuList();
          } else {
            return parent.$.messager.alert('错误', data.message, 'error');
          }
        });
      });
    }
  };

  this.addMenuGroup = function() {
    parent.$.modalDialog.openner_treeGrid = treeGrid;
    return parent.$.modalDialog({
      title: '添加菜单组别',
      width: 670,
      height: 330,
      href: $addMenuGroupViewUrl,
      buttons: [
        {
          text: '确定',
          iconCls: 'ico-save',
          handler: function() {
            var frm;
            frm = parent.$.modalDialog.handler.find('#form');
            if (frm) {
              return frm.submit();
            }
          }
        }, {
          text: '取消',
          iconCls: 'ico-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

  this.modifyMenuGroup = function(groupId) {
    var row;
    if (groupId != null) {
      treeGrid.treegrid('select', groupId);
    }
    row = treeGrid.treegrid('getSelected');
    parent.$.modalDialog.openner_treeGrid = treeGrid;
    if (row) {
      return parent.$.modalDialog({
        title: "修改菜单组别 - " + row.Name,
        width: 670,
        height: 330,
        href: $modifyMenuGroupViewUrl + ("?groupId=" + row.Id),
        buttons: [
          {
            text: '确定',
            iconCls: 'ico-save',
            handler: function() {
              var frm;
              frm = parent.$.modalDialog.handler.find('#form');
              if (frm) {
                return frm.submit();
              }
            }
          }, {
            text: '取消',
            iconCls: 'ico-cancel',
            handler: function() {
              return parent.$.modalDialog.handler.dialog('close');
            }
          }
        ]
      });
    }
  };

  this.removeMenuGroup = function(groupId) {
    var row;
    if (groupId != null) {
      treeGrid.treegrid('select', groupId);
    }
    row = treeGrid.treegrid('getSelected');
    if (row) {
      return parent.$.messager.confirm('询问', "您确定要删除当前选中的 [" + row.Name + "] 菜单组吗？", function(r) {
        if (!r) {
          return;
        }
        parent.$.messager.progress({
          title: '提示',
          text: '数据处理中，请稍后...'
        });
        return $.post($removeMenuGroupUrl, {
          groupId: row.Id
        }, function(data) {
          parent.$.messager.progress('close');
          if (data.isSuccess) {
            treeGrid.treegrid('reload');
            return parent.refreshMenuList();
          } else {
            return parent.$.messager.alert('错误', data.message, 'error');
          }
        });
      });
    }
  };

}).call(this);
