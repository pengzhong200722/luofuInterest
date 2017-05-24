(function() {
  var getSelectedTypeId, typeDataGrid, valueDataGrid;

  valueDataGrid = {};

  typeDataGrid = {};

  $(function() {
    typeDataGrid = $('#typeDataGrid').datagrid({
      url: $typeDataGridUrl,
      toolbar: '#typeDataGridToolbar',
      idField: 'Id',
      border: false,
      fit: true,
      fitColumns: true,
      singleSelect: true,
      frozenColumns: [
        [
          {
            title: 'Id',
            field: 'Id',
            hidden: true
          }
        ]
      ],
      columns: [
        [
          {
            title: '名称',
            field: 'TypeName',
            width: 50
          }, {
            title: '描述',
            field: 'Description',
            width: 70
          }
        ]
      ],
      onDblClickRow: function(rowIndex, rowData) {
        return modifyItemsType();
      },
      onSelect: function(rowIndex, rowData) {
        if (rowData != null) {
          return valueDataGrid.datagrid('load', {
            typeId: rowData.Id
          });
        }
      },
      onRowContextMenu: function(e, rowIndex, rowData) {
        e.preventDefault();
        $(this).datagrid('unselectAll');
        $(this).datagrid('uncheckAll');
        $(this).datagrid('selectRow', rowIndex);
        return $('#typeDataGridMenu').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      }
    });
    return valueDataGrid = $('#valueDataGrid').datagrid({
      url: $valueDataGridUrl,
      toolbar: '#valueDataGridToolbar',
      rownumbers: true,
      pagination: true,
      idField: 'Id',
      border: false,
      fit: true,
      fitColumns: true,
      singleSelect: true,
      frozenColumns: [
        [
          {
            title: 'Id',
            field: 'Id',
            hidden: true
          }
        ]
      ],
      columns: [
        [
          //{
          //  title: '类别',
          //  field: 'TypeName',
          //  width: 80
          //},
          {
            title: '名称',
            field: 'Name',
            width: 100
          }, {
            title: '值',
            field: 'Value',
            width: 100
          }, {
            title: '排序',
            field: 'Order',
            width: 80
          }, {
            title: '描述',
            field: 'Description',
            width: 200
          }
        ]
      ],
      onDblClickRow: function(rowIndex, rowData) {
        return modifyItemsValue();
      },
      onRowContextMenu: function(e, rowIndex, rowData) {
        e.preventDefault();
        $(this).datagrid('unselectAll');
        $(this).datagrid('uncheckAll');
        $(this).datagrid('selectRow', rowIndex);
        return $('#valueDataGridMenu').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      }
    });
  });

  this.refreshItemsType = function() {
    return typeDataGrid.datagrid('reload');
  };

  this.addItemsType = function() {
    parent.$.modalDialog.openner_dataGrid = typeDataGrid;
    return parent.$.modalDialog({
      title: '添加字典类型',
      width: 500,
      height: 330,
      href: $addItemsTypeViewUrl,
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

  this.modifyItemsType = function() {
    var row;
    row = typeDataGrid.datagrid('getSelected');
    if (!(row != null)) {
      $tips.error('请选择要修改的记录！');
      return;
    }
    parent.$.modalDialog.openner_dataGrid = typeDataGrid;
    return parent.$.modalDialog({
      title: "修改字典类型 - " + row.Name,
      width: 500,
      height: 330,
      href: $modifyItemsTypeViewUrl + ("?id=" + row.Id),
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

  getSelectedTypeId = function() {
    var row;
    row = typeDataGrid.datagrid('getSelected');
    if (row != null) {
      return row.Id;
    } else {
      return '';
    }
  };

  this.refreshItemsValue = function() {
    return valueDataGrid.datagrid('reload');
  };

  this.addItemsValue = function() {
    parent.$.modalDialog.openner_dataGrid = valueDataGrid;
    return parent.$.modalDialog({
      title: '添加字典值',
      width: 670,
      height: 370,
      href: $addItemsValueViewUrl + ("?typeId=" + (getSelectedTypeId())),
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

  this.modifyItemsValue = function() {
    var row;
    row = valueDataGrid.datagrid('getSelected');
    if (!(row != null)) {
      $tips.error('请选择要修改的记录！');
      return;
    }
    parent.$.modalDialog.openner_dataGrid = valueDataGrid;
    return parent.$.modalDialog({
      title: "修改字典值 - " + row.Name,
      width: 670,
      height: 370,
      href: $modifyItemsValueViewUrl + ("?id=" + row.Id),
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

  this.removeItemsValue = function() {
    var row;
    row = valueDataGrid.datagrid('getSelected');
    if (!(row != null)) {
      $tips.error('请选择要删除的记录！');
      return;
    }
    return parent.$.messager.confirm('询问', "您确定要删除当前选中的 [" + row.Name + "] 吗？", function(r) {
      if (!r) {
        return;
      }
      parent.$.messager.progress({
        title: '提示',
        text: '数据处理中，请稍后...'
      });
      return $.post($removeItemsValueUrl, {
        id: row.Id
      }, function(data) {
        parent.$.messager.progress('close');
        if (data.isSuccess) {
          return valueDataGrid.datagrid('reload');
        } else {
          return parent.$.messager.alert('错误', data.message, 'error');
        }
      });
    });
  };

}).call(this);
