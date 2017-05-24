(function() {
  var dataGrid, dataGridColumns, empowerRoleProcess;

  dataGrid = {};

  $(function() {
    return dataGrid = $('#dataGrid').datagrid({
      url: $dataGridUrl,
      fit: true,
      fitColumns: true,
      border: false,
      rownumbers: true,
      idField: 'RoleId',
      checkOnSelect: true,
      selectOnCheck: true,
      frozenColumns: [
        [
          {
            field: 'RoleId',
            title: '编号',
            width: 150,
            checkbox: true
          }, {
            field: 'Action',
            title: '操作',
            align: 'center',
            width: 88,
            formatter: function(value, row, index) {
              var html;
              html = "<div class=\"grid-controls\"><a href=\"javascript:void(0)\" class=\"easyui-menubutton\" data-options=\"menu:'#mm" + row.RoleId + "',iconCls:'icon-edit-down'\">编辑</a><div id=\"mm" + row.RoleId + "\" style=\"width:100px;\"><div onclick=\"modifyRole('" + row.RoleId + "');\" data-options=\"iconCls:'icon-edit'\">修改</div><div onclick=\"empowerRole('" + row.RoleId + "');\" data-options=\"iconCls:'icon-permission'\">授权</div><div onclick=\"removeRole('" + row.RoleId + "');\" data-options=\"iconCls:'icon-remove'\">删除</div></div></div>";
              return html;
            }
          }, {
            field: 'RoleName',
            title: '角色名称',
            width: 160
          }
        ]
      ],
      columns: [dataGridColumns],
      toolbar: '#toolbar',
      onDblClickRow: function(rowIndex, rowData) {
        return modifyRole(rowData.RoleId);
      },
      onRowContextMenu: function(e, rowIndex, rowData) {
        e.preventDefault();
        dataGrid.datagrid('unselectAll');
        dataGrid.datagrid('uncheckAll');
        dataGrid.datagrid('selectRow', rowIndex);
        return $('#menu').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      }
    });
  });

  dataGridColumns = [
    {
      field: 'Description',
      title: '角色描述',
      width: 150
    }
  ];

  this.refreshGrid = function() {
    return dataGrid.datagrid('reload');
  };

  this.addRole = function() {
    parent.$.modalDialog.openner_dataGrid = dataGrid;
    return parent.$.modalDialog({
      title: '添加角色',
      width: 500,
      height: 300,
      href: $addRoleViewUrl,
      buttons: [
        {
          text: '确定',
          iconCls: 'icon-save',
          handler: function() {
            var frm;
            frm = parent.$.modalDialog.handler.find('#form');
            if (frm) {
              return frm.submit();
            }
          }
        }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

  this.modifyRole = function(roleid) {
    var row;
    if (roleid != null) {
      dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
      dataGrid.datagrid('selectRecord', roleid);
    }
    row = dataGrid.datagrid('getSelected');
    if (!(row != null)) {
      return;
    }
    dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
    dataGrid.datagrid('selectRecord', row.Id);
    parent.$.modalDialog.openner_dataGrid = dataGrid;
    return parent.$.modalDialog({
      title: "修改角色 - " + row.RoleName,
      width: 500,
      height: 300,
      href: $modifyRoleViewUrl + ("?id=" + row.RoleId),
      buttons: [
        {
          text: '确定',
          iconCls: 'icon-save',
          handler: function() {
            var frm;
            frm = parent.$.modalDialog.handler.find('#form');
            if (frm) {
              return frm.submit();
            }
          }
        }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

  this.removeRole = function(roleid) {
    var row;
    if (roleid != null) {
      dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
      dataGrid.datagrid('selectRecord', roleid);
    }
    row = dataGrid.datagrid('getSelected');
    if (!(row != null)) {
      return;
    }
    dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
    dataGrid.datagrid('selectRecord', row.Id);
    return parent.$.messager.confirm('询问', "您确定要删除当前选中的 [" + row.RoleName + "] 角色吗？", function (r) {
      if (!r) {
        return;
      }
      parent.$.messager.progress({
        title: '提示',
        text: '数据处理中，请稍后...'
      });
      return $.post($removeRoleUrl, {
        id: row.RoleId
      }, function(data) {
        parent.$.messager.progress('close');
        if (data.isSuccess) {
          dataGrid.datagrid('reload');
          return parent.refreshMenuList();
        } else {
          return parent.$.messager.alert('错误', data.message, 'error');
        }
      });
    });
  };

  this.empowerRole = function(roleid) {
    var row;
    if (roleid != null) {
      dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
      dataGrid.datagrid('selectRecord', roleid);
    }
    row = dataGrid.datagrid('getSelected');
    if (!(row != null)) {
      return;
    }
    dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
    dataGrid.datagrid('selectRecord', row.RoleId);
    return parent.$.modalDialog({
      title: "角色授权 - " + row.RoleName,
      width: 330,
      height: 530,
      href: $empowerRoleViewUrl + ("?id=" + row.RoleId),
      buttons: [
        {
          text: '确定',
          iconCls: 'icon-save',
          handler: function() {
            var checkedItems, item, menuIds, treeMenu;
            treeMenu = parent.$.modalDialog.handler.find('#treeMenu');
            checkedItems = treeMenu.tree('getChecked');
            menuIds = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = checkedItems.length; _i < _len; _i++) {
                item = checkedItems[_i];
                if (item.attributes && item.attributes.type === 1) {
                  _results.push(item.id);
                }
              }
              return _results;
            })();
            parent.$.modalDialog.handler.dialog('close');
            return empowerRoleProcess([row.RoleId], menuIds);
          }
        }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

  empowerRoleProcess = function(roleIds, menuIds) {
    if (!roleIds) {
      return;
    }
    return $.post($empowerRoleUrl, {
      roleIds: roleIds,
      menuIds: menuIds
    }, function(data) {
      if (data.isSuccess) {
        $tips.info('授权操作成功！');
        return parent.refreshMenuList();
      } else {
        return parent.$.messager.alert('错误', data.message, 'error');
      }
    });
  };

  this.batchRemoveRole = function() {
    var ids, r, selectedRows;
    selectedRows = dataGrid.datagrid('getSelections');
    ids = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = selectedRows.length; _i < _len; _i++) {
        r = selectedRows[_i];
        _results.push(r.Id);
      }
      return _results;
    })();
    if (ids.length <= 0) {
      $tips.error('请勾选要删除的记录！');
      return;
    }
    return parent.$.messager.confirm('询问', '您确定要删除当前选中的角色吗？', function(r) {
      if (!r) {
        return;
      }
      parent.$.messager.progress({
        title: '提示',
        text: '数据处理中，请稍后...'
      });
      return $.post($batchRemoveRoleUrl, {
        ids: ids
      }, function(data) {
        parent.$.messager.progress('close');
        if (data.isSuccess) {
          dataGrid.datagrid('reload');
          return parent.refreshMenuList();
        } else {
          return parent.$.messager.alert('错误', data.message, 'error');
        }
      });
    });
  };

  this.batchEmpowerRole = function() {
    var r, roleIds, selectedRows;
    selectedRows = dataGrid.datagrid('getSelections');
    roleIds = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = selectedRows.length; _i < _len; _i++) {
        r = selectedRows[_i];
        _results.push(r.RoleId);
      }
      return _results;
    })();
    if (roleIds.length <= 0) {
      $tips.error('请勾选要授权的角色！');
      return;
    }
    return parent.$.modalDialog({
      title: '角色批量授权',
      width: 300,
      height: 500,
      href: $batchEmpowerRoleViewUrl,
      buttons: [
        {
          text: '确定',
          iconCls: 'icon-save',
          handler: function() {
            var checkedItems, item, menuIds, treeMenu;
            treeMenu = parent.$.modalDialog.handler.find('#treeMenu');
            checkedItems = treeMenu.tree('getChecked');
            menuIds = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = checkedItems.length; _i < _len; _i++) {
                item = checkedItems[_i];
                if (item.attributes && item.attributes.type === 1) {
                  _results.push(item.id);
                }
              }
              return _results;
            })();
            parent.$.modalDialog.handler.dialog('close');
            return empowerRoleProcess(roleIds, menuIds);
          }
        }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
            return parent.$.modalDialog.handler.dialog('close');
          }
        }
      ]
    });
  };

}).call(this);
