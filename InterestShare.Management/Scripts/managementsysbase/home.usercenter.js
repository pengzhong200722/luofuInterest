(function() {

  $(function() {
    $('#portal').portal({
      border: false,
      fit: true
    });
    $('#appRegisterDatagrid').datagrid({
      url: $appRegisterDataGridUrl,
      fit: true,
      fitColumns: false,
      border: false,
      rownumbers: true,
      pagination: true,
      idField: 'Id',
      singleSelect: true,
      frozenColumns: [
        [
          {
            field: 'Id',
            title: '编号',
            hidden: true
          }, {
            field: 'Name',
            title: '应用名称',
            sortable: true,
            width: 160
          }
        ]
      ],
      columns: [
        [
          {
            field: 'AuditState',
            title: '审核状态',
            align: 'center',
            width: 88,
            sortable: true,
            formatter: function(value, row, index) {
              if (value === 1) {
                return "<span style=\"color:#339933;\">等待中</span>";
              } else {
                return "<span style=\"color:#E51400;\">未通过</span>";
              }
            }
          }, {
            field: 'SystemName',
            title: '所属系统',
            sortable: true,
            width: 150
          }, {
            field: 'PlatformName',
            title: '适用平台',
            width: 120
          }, {
            field: 'IsRequired',
            title: '核心应用',
            align: 'center',
            width: 88,
            sortable: true,
            formatter: function(value, row, index) {
              if (value) {
                return "<span style=\"color:#E51400;\">是</span>";
              } else {
                return "<span style=\"color:#339933;\">否</span>";
              }
            }
          }, {
            field: 'CreatedDate',
            title: '创建日期',
            width: 150,
            sortable: true,
            formatter: function(value, row, index) {
              var date;
              date = eval('new ' + eval(value).source);
              return date.format();
            }
          }
        ]
      ],
      onLoadSuccess: function() {}
    });
    $('#appPublishDatagrid').datagrid({
      url: $appPublishDataGridUrl,
      fit: true,
      fitColumns: false,
      border: false,
      rownumbers: true,
      pagination: true,
      idField: 'Id',
      singleSelect: true,
      frozenColumns: [
        [
          {
            field: 'Id',
            title: '编号',
            width: 150,
            hidden: true
          }, {
            field: 'AppName',
            title: '应用名称',
            width: 150
          }, {
            field: 'Version',
            title: '版本编号',
            sortable: true,
            width: 120
          }
        ]
      ],
      columns: [
        [
          {
            field: 'AuditState',
            title: '审核状态',
            align: 'center',
            width: 88,
            sortable: true,
            formatter: function(value, row, index) {
              if (value === 1) {
                return "<span style=\"color:#339933;\">等待中</span>";
              } else {
                return "<span style=\"color:#E51400;\">未通过</span>";
              }
            }
          }, {
            field: 'IsRequired',
            title: '必备版本',
            align: 'center',
            width: 88,
            sortable: true,
            formatter: function(value, row, index) {
              if (value) {
                return "<span style=\"color:#E51400;\">是</span>";
              } else {
                return "<span style=\"color:#339933;\">否</span>";
              }
            }
          }, {
            field: 'CreatedDate',
            title: '创建日期',
            width: 150,
            sortable: true,
            formatter: function(value, row, index) {
              var date;
              date = eval('new ' + eval(value).source);
              return date.format();
            }
          }
        ]
      ],
      onLoadSuccess: function() {}
    });
    return $('#myAppDatagrid').datagrid;
  });

}).call(this);
