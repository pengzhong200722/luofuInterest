(function () {
    var dataGrid, dataGridColumns;
    dataGrid = {};
    $(function () {
        dataGrid = $('#dataGrid').datagrid({
            url: $dataGridUrl,
            fit: true,
            fitColumns: false,
            border: false,
            rownumbers: true,
            pagination: true,
            pageSize: 15,
            pageList: [15, 20, 30, 40, 50],
            idField: 'UserId',
            checkOnSelect: true,
            selectOnCheck: true,
            columns: [dataGridColumns],
            toolbar: '#toolbar',
            onDblClickRow: function (rowIndex, rowData) {
                return modifyUser(rowData.UserId);
            },
            onRowContextMenu: function (e, rowIndex, rowData) {
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
        $('#searchForm input').keyup(function (evt) {
            if (evt.keyCode === 13) {
                return searchUsers();
            }
        });
        return $('#searchForm table').show();
    });
    
    dataGridColumns=[
        {
            field: 'UserId',
            title: '编号',
            width: 150,
            checkbox: true
        }, {
            field: 'Action',
            title: '操作',
            width: 120,
            formatter: function (value, row, index) {
                var html;
                html = "<div class=\"grid-controls\"><a href=\"javascript:void(0)\" class=\"easyui-menubutton\"                                      data-options=\"menu:'#mm" + row.UserId + "',iconCls:'icon-edit-down'\">编辑</a>                                  <div id=\"mm" + row.UserId + "\" style=\"width:100px;\">                                      <div onclick=\"modifyUser('" + row.UserId + "');\" data-options=\"iconCls:'icon-edit'\">修改</div>                                    <div onclick=\"removeUser('" + row.UserId + "');\" data-options=\"iconCls:'icon-remove'\">删除</div>                                  </div>                              </div>";
                return html;
            }
        },
        {
            field: 'Name',
            title: '用户名',
            width: 150
        }, {
            field: 'UserName',
            title: '登入账号',
            sortable: true,
            width: 150
        }, {
            field: 'RoleName',
            title: '角色名称',
            width: 200
        }, {
            field: 'UserEmail',
            title: '邮箱地址',
            width: 250,
            sortable: true
        }, {
            field: 'IsUsing',
            title: '是否启用',
            align: 'center',
            width: 100,
            sortable: true,
            formatter: function (value, row, index) {
                if (value) {
                    return "<span style=\"color:#E51400;\">是</span>";
                } else {
                    return "<span style=\"color:#339933;\">否</span>";
                }
            }
        }
    ];

    this.refreshGrid = function () {
        return dataGrid.datagrid('reload');
    };

    this.searchUsers = function () {
        return dataGrid.datagrid('load', $.serializeObject($('#searchForm')));
    };

    this.clearFilters = function () {
        $('#searchForm input').val('');
        //$('#searchForm select').combobox('select', 'null');
        $('#searchForm select').combobox('select', '[全部]');
        return dataGrid.datagrid('load', {});
    };

    this.addUser = function () {
        parent.$.modalDialog.openner_dataGrid = dataGrid;
        return parent.$.modalDialog({
            title: '添加用户',
            width: 630,
            height: 300,
            href: $addUserViewUrl,
            buttons: [
              {
                  text: '确定',
                  iconCls: 'icon-save',
                  handler: function () {
                      var frm;
                      frm = parent.$.modalDialog.handler.find('#form');
                      if (frm) {
                          return frm.submit();
                      }
                  }
              }, {
                  text: '取消',
                  iconCls: 'icon-cancel',
                  handler: function () {
                      return parent.$.modalDialog.handler.dialog('close');
                  }
              }
            ]
        });
    };

    this.modifyUser = function (userid) {
        var row;
        if (userid != null) {
            dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
            dataGrid.datagrid('selectRecord', userid);
        }
        row = dataGrid.datagrid('getSelected');
        if (!(row != null)) {
            return;
        }
        dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
        dataGrid.datagrid('selectRecord', row.UserId);
        parent.$.modalDialog.openner_dataGrid = dataGrid;
        return parent.$.modalDialog({
            title: "修改角色 - " + row.UserName,
            width: 630,
            height: 300,
            href: $modifyUserViewUrl + ("?id=" + row.UserId),
            buttons: [
              {
                  text: '确定',
                  iconCls: 'icon-save',
                  handler: function () {
                      var frm;
                      frm = parent.$.modalDialog.handler.find('#form');
                      if (frm) {
                          return frm.submit();
                      }
                  }
              }, {
                  text: '取消',
                  iconCls: 'icon-cancel',
                  handler: function () {
                      return parent.$.modalDialog.handler.dialog('close');
                  }
              }
            ]
        });
    };

    this.removeUser = function (userid) {
        var row;
        if (userid != null) {
            dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
            dataGrid.datagrid('selectRecord', userid);
        }
        row = dataGrid.datagrid('getSelected');
        if (!(row != null)) {
            return;
        }
        dataGrid.datagrid('unselectAll').datagrid('uncheckAll');
        dataGrid.datagrid('selectRecord', row.UserId);
        //if (row.IsSuper) {
        //  parent.$.messager.alert('错误', '不能删除管理员用户！', 'error');
        //  return;
        //}
        return parent.$.messager.confirm('询问', "您确定要删除当前选中的 [" + row.UserName + "] 用户吗？", function (r) {
            if (!r) {
                return;
            }
            parent.$.messager.progress({
                title: '提示',
                text: '数据处理中，请稍后...'
            });
            return $.post($removeUserUrl, {
                id: row.UserId
            }, function (data) {
                parent.$.messager.progress('close');
                if (data.isSuccess) {
                    return dataGrid.datagrid('reload');
                } else {
                    return parent.$.messager.alert('错误', data.message, 'error');
                }
            });
        });
    };

    this.batchRemoveUser = function () {
        var ids, r, selectedRows;
        selectedRows = dataGrid.datagrid('getSelections');
        ids = (function () {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = selectedRows.length; _i < _len; _i++) {
                r = selectedRows[_i];
                _results.push(r.UserId);
            }
            return _results;
        })();
        if (ids.length <= 0) {
            $tips.error('请勾选要删除的记录！');
            return;
        }
        return parent.$.messager.confirm('询问', '您确定要删除当前选中的用户吗？', function (r) {
            if (!r) {
                return;
            }
            parent.$.messager.progress({
                title: '提示',
                text: '数据处理中，请稍后...'
            });
            return $.post($batchRemoveUserUrl, {
                ids: ids
            }, function (data) {
                parent.$.messager.progress('close');
                if (data.isSuccess) {
                    return dataGrid.datagrid('reload');
                } else {
                    return parent.$.messager.alert('错误', data.message, 'error');
                }
            });
        });
    };

    this.batchSetUserRole = function () {
        var ids, r, selectedRows;
        selectedRows = dataGrid.datagrid('getSelections');
        ids = (function () {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = selectedRows.length; _i < _len; _i++) {
                r = selectedRows[_i];
                _results.push(r.UserId);
            }
            return _results;
        })();
        if (ids.length <= 0) {
            $tips.error('请勾选要指定角色的记录！');
            return;
        }
        return parent.$.modalDialog({
            title: '批量指定角色',
            width: 350,
            height: 160,
            href: $batchSetUserRoleViewUrl,
            buttons: [
              {
                  text: '确定',
                  iconCls: 'icon-save',
                  handler: function () {
                      var selectRoleId;
                      selectRoleId = parent.$.modalDialog.handler.find('#selectRoles').combobox('getValue');
                      return $.post($batchSetUserRoleUrl, {
                          userIds: ids,
                          roleId: selectRoleId
                      }, function (data) {
                          if (data.isSuccess) {
                              dataGrid.datagrid('reload');
                              return parent.$.modalDialog.handler.dialog('close');
                          } else {
                              return parent.$.messager.alert('错误', data.message, 'error');
                          }
                      });
                  }
              }, {
                  text: '取消',
                  iconCls: 'icon-cancel',
                  handler: function () {
                      return parent.$.modalDialog.handler.dialog('close');
                  }
              }
            ]
        });
    };

}).call(this);
