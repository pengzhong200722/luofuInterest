var newIframe;
(function () {
    var index_tabs, index_tabsMenu, openNewTab, refreshTab;
    $(".txt_number").live("keyup", function () {
        $(this).val($(this).val().replace(/\D/g, ''))
    });
    $(".txt_number").live("blur", function () {
        $(this).val($(this).val().replace(/\D/g, ''))
    });

    index_tabs = {};

    index_tabsMenu = {};

    $(function () {
        if ($.cookie('easyuiThemeName')) {
            changeTheme($.cookie('easyuiThemeName'));
        }

        if ($.cookie('easyuiThemeName')) {
            $('#layout_north_pfMenu').menu('setIcon', {
                target: $("#layout_north_pfMenu div[title=" + ($.cookie('easyuiThemeName')) + "]")[0],
                iconCls: 'icon-tick'
            });
        } else {
            $('#layout_north_pfMenu').menu('setIcon', {
                target: $("#layout_north_pfMenu div[title=bootstrap]")[0],
                iconCls: 'icon-tick'
            });
        }
        index_tabs = $('#index_tabs').tabs({
            fit: true,
            border: false,
            onContextMenu: function (e, title) {
                e.preventDefault();
                return index_tabsMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY
                }).data('tabTitle', title);
            },
            tools: [
              {
                  iconCls: 'icon-reload',
                  handler: function () {
                      var selectedTab;
                      selectedTab = index_tabs.tabs('getSelected');
                      return refreshTab(selectedTab.panel('options').title);
                  }
              }, {
                  iconCls: 'icon-close',
                  handler: function () {
                      var selectedTab, selectedTabIndex;
                      selectedTabIndex = index_tabs.tabs('getTabIndex', index_tabs.tabs('getSelected'));
                      selectedTab = index_tabs.tabs('getTab', selectedTabIndex);
                      if (selectedTab.panel('options').closable) {
                          return index_tabs.tabs('close', selectedTabIndex);
                      }
                  }
              }
            ]
        });
        return index_tabsMenu = $('#index_tabsMenu').menu({
            onClick: function (item) {
                var allTabs, closeTabsTitle, curTab, curTabTitle, tb, tbOption, tbTitle, type, _i, _len, _results;
                curTabTitle = $(this).data('tabTitle');
                curTab = index_tabs.tabs('getTab', curTabTitle);
                type = $(item.target).attr('title');
                if (type === 'refresh') {
                    refreshTab(curTabTitle);
                    return;
                }
                if (type === 'close') {
                    if (curTab.panel('options').closable) {
                        index_tabs.tabs('close', curTabTitle);
                    }
                    return;
                }
                allTabs = index_tabs.tabs('tabs');
                closeTabsTitle = (function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = allTabs.length; _i < _len; _i++) {
                        tb = allTabs[_i];
                        tbOption = tb.panel('options');
                        if (tbOption.closable && tbOption.title !== curTabTitle && type === 'closeOther') {
                            _results.push(tbOption.title);
                        } else if (tbOption.closable && type === 'closeAll') {
                            _results.push(tbOption.title);
                        } else {
                            continue;
                        }
                    }
                    return _results;
                })();
                _results = [];
                for (_i = 0, _len = closeTabsTitle.length; _i < _len; _i++) {
                    tbTitle = closeTabsTitle[_i];
                    _results.push(index_tabs.tabs('close', tbTitle));
                }
                return _results;
            }
        });
    });

    this.refreshMenuList = function () {
        return $('body').layout('panel', 'west').panel('refresh');
    };

    this.onMenuListLoad = function () {
        return $('.left-menus .tree-node').bind({
            click: function () {
                var title, url;
                $('.left-menus .tree-node').removeClass('tree-node-selected');
                $(this).addClass('tree-node-selected');
                url = $(this).find('span.href').text();
                title = $(this).find('span.tree-title').text();
                return openNewTab({
                    url: url,
                    title: title,
                    iconCls: 'icon-ok'
                });
            },
            mouseover: function () {
                return $(this).addClass('tree-node-hover');
            },
            mouseout: function () {
                return $(this).removeClass('tree-node-hover');
            }
        });
    };

    refreshTab = function (which) {
        var href, ifr, iframes, selectedTab, _i, _len;
        selectedTab = index_tabs.tabs('getTab', which);
        href = selectedTab.panel('options').href;
        if (href) {
            return selectedTab.panel('refresh');
        } else {
            iframes = selectedTab.panel('panel').find('iframe');
            try {
                if (iframes.length > 0) {
                    for (_i = 0, _len = iframes.length; _i < _len; _i++) {
                        ifr = iframes[_i];
                        ifr.contentWindow.document.write('');
                        ifr.contentWindow.close();
                        ifr.src = ifr.src;
                    }
                    if (navigator.userAgent.indexOf("MSIE") > 0) {
                        try {
                            return CollectGarbage();
                        } catch (_error) { }
                    }
                }
            } catch (_error) { }
        }
    };


    ajaxLoading = function () {
        $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height(), 'z-index':'9999999999' }).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({'z-index':'9999999999','font-size':'13px', display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
    }


    ajaxLoadEnd = function () {
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    }


    OpenLoading = function (iframeId) {
       
        ajaxLoading();
        var iframe = document.getElementById(iframeId);
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
                ajaxLoadEnd();
            });
        } else {
            iframe.onload = function () {
                ajaxLoadEnd();
            };
        }

    }


    openNewTab = function (options) {
        var iframe, tabOptions;
        if (options.url.indexOf('/' === 0)) {
            options.url = systemBaseUrl + options.url;
        }

        var iframeId = escape(options.url);

        iframe = '<iframe id="' + iframeId + '" src="' + options.url + '" frameborder="0" style="border:0;width:100%;height:100%;padding:0px"></iframe>';

        tabOptions = {
            title: options.title,
            closable: true,
            loadingMessage: '数据处理中，请稍后...',
            iconCls: options.iconCls,
            content: iframe,
            border: false,
            fit: true
        };

        var currentTab;

        if (index_tabs.tabs('exists', tabOptions.title)) {
            currentTab = index_tabs.tabs('select', tabOptions.title);
        } else {
            //closeAllTabs();
            currentTab = index_tabs.tabs('add', tabOptions);
            OpenLoading(iframeId);
        }
        $('iframe[src="' + options.url + '"]').parent().css({ 'overflow': 'hidden' });

        

        return currentTab;
    };

    //this.changeTheme = function (themeName) {
    //    var $easyuiTheme = $('#easyuiTheme');
    //    var url = $easyuiTheme.attr('href');
    //    var href = url.substring(0, url.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
    //    $easyuiTheme.attr('href', href);
    //    var $iframe = $('iframe');
    //    if ($iframe.length > 0) {
    //        for (var i = 0; i < $iframe.length; i++) {
    //            var ifr = $iframe[i];
    //            $(ifr).contents().find('#easyuiTheme').attr('href', href);
    //        }
    //    }
    //    $.cookie('easyuiThemeName', themeName, {
    //        expires: 7
    //    });
    //};


    this.changeTheme = function (themeName) {
        var $easyuiTheme, $iframe, href, ifr, url, _i, _len;
        if ($.cookie('easyuiThemeName')) {
            $('#layout_north_pfMenu').menu('setIcon', {
                target: $("#layout_north_pfMenu div[title=" + ($.cookie('easyuiThemeName')) + "]")[0],
                iconCls: 'emptyIcon'
            });
        } else {
            $('#layout_north_pfMenu').menu('setIcon', {
                target: $("#layout_north_pfMenu div[title=bootstrap]")[0],
                iconCls: 'emptyIcon'
            });
        }
        $('#layout_north_pfMenu').menu('setIcon', {
            target: $("#layout_north_pfMenu div[title=" + themeName + "]")[0],
            iconCls: 'icon-tick'
        });
        $easyuiTheme = $('#easyuiTheme');
        url = $easyuiTheme.attr('href');
        href = url.substring(0, url.indexOf('themes')) + ("themes/" + themeName + "/easyui.css");
        $easyuiTheme.attr('href', href);
        $iframe = $('iframe');
        if ($iframe.length > 0) {
            for (_i = 0, _len = $iframe.length; _i < _len; _i++) {
                ifr = $iframe[_i];
                try {
                    $(ifr).contents().find('#easyuiTheme').attr('href', href);
                } catch (error) {
                    try {
                        ifr.contentWindow.document.getElementById('easyuiTheme').href = href;
                    } catch (_error) { }
                }
            }
        }
        return $.cookie('easyuiThemeName', themeName, {
            expires: 7,
            path: "/"
        });
    };

    this.exitSystem = function () {
        $.messager.confirm('系统提示', '您确定要退出本次登录吗?', function (r) {
            $.messager.progress({
                title: '提示',
                text: '数据处理中，请稍后...'
            });
            return $.post(logoutPostUrl, function () {
                return window.location.href = loginUrl;
            });
        });
    };

    this.reloginSystem = function () {
        return $.modalDialog({
            iconCls: 'icon-logoff',
            title: '重新登录系统',
            width: 340,
            height: 202,
            href: $reloginViewUrl + ("?username=" + (escape($('#loginName span').text()))),
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

    this.setLoginUserName = function (username) {
        return $('#sessionInfoDiv span').text(username);
    };

    this.closeAllTabs = function () {
        var allTabs, closeTabsTitle, tb, tbOption, tbTitle, _i, _len, _results;
        allTabs = index_tabs.tabs('tabs');
        closeTabsTitle = (function () {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = allTabs.length; _i < _len; _i++) {
                tb = allTabs[_i];
                tbOption = tb.panel('options');
                if (tbOption.closable) {
                    _results.push(tbOption.title);
                } else {
                    continue;
                }
            }
            return _results;
        })();
        _results = [];
        for (_i = 0, _len = closeTabsTitle.length; _i < _len; _i++) {
            tbTitle = closeTabsTitle[_i];
            _results.push(index_tabs.tabs('close', tbTitle));
        }
        return _results;
    };

    this.modifyLoginPassword = function () {
        return $.modalDialog({
            iconCls: 'icon-key',
            title: '修改登录密码',
            width: 320,
            height: 200,
            href: $modifyPasswordViewUrl,
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

    newIframe = function (url, title) {
        if (url == '') {
            $.messager.alert('提示', '账户不具备此权限', 'info');
            return;
        }
        return openNewTab({
            url: url,
            title: title,
            iconCls: 'icon-ok'
        });
    }

    //公用日志窗口
    ///rid：可以不用传
    this.OpenLogInfoWin = function (moduleID, rid)
    {
        var boarddiv = "<div id='edit_Win_log_" + moduleID + "' class='easyui-window' modal='true' closed='true' style='width:1100px;height:620px;'><div class='easyui-layout' style='width:100%;height:100%;' data-options='fit:true,border:false'>"
        if (!rid) {
            boarddiv += "<div region='north' border='false' style='border-bottom: 1px solid #ddd; height:27px; padding: 5px 5px; background: #fafafa;'>"
            + " <div style='float: left;margin-left:10px'>"
            + " <span>关联ID: </span>"
            + " <input id='search_RelationID_log_" + moduleID + "' style='line-height:20px;border:1px solid #ccc;width:208px' class='txt_number' >"
            + "</div>"
            + "<div id='tb' style='float:left;'>"
            + " <a href='javascript:;' class='easyui-linkbutton l-btn' id='search_Button_log_" + moduleID + "' onclick='logSearch(" + moduleID + ")' data-options='iconCls:'icon-search'' group=''><span class='l-btn-left'><span class='l-btn-text icon-search l-btn-icon-left'>查 询</span></span></a>"
            + " </div>"
            + " </div>"
        }
        boarddiv += "  <div data-options='region:\"center\"' id='dataList_log_panel_" + moduleID + "' style='height:90%;'><table border='0' data-options='border:false' id='datalist_log_" + moduleID + "'></table></div></div></div>";
        $(document.body).append(boarddiv);

        $.parser.parse($('#search_Button_log_' + moduleID))
        var user = {
            ModuleID: moduleID,
            ResourceID: rid,
        };

        $("#datalist_log_" + moduleID + "").datagrid({
            url: '/api/OperationLog/GetList',
            queryParams: user,
            fit: true,
            fitColumns: true,
            striped: true,
            singleSelect: true,
            method: 'post',
            rownumbers: true,
            nowrap: false,
            pagination: true,
            pageSize: 20,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                { field: 'ID', align: 'center', title: '编号', width: 10, hidden: true },
                { field: 'RelationId', align: 'center', title: '关联ID', width: 30 },
                { field: 'CreateEmployeeID', align: 'center', title: '操作人ID', width: 15,hidden:true },
                { field: 'CreateUser', title: '操作人', align: 'center', width: 17 },
                { field: 'ModuleName', title: '操作模块', align: 'center', width: 20 },
                { field: 'OperationTypeName', title: '操作类型', align: 'center', width: 15 },
                { field: 'OperationContent', title: '操作说明', width: 140 },
                {
                    field: 'CreateTime', align: 'center', title: '更新时间', width: 20, formatter: function (value) {
                        return value.replace("T", " ").substring(0, value.indexOf('.'));
                    }
                }
            ]]
        });

        $("#edit_Win_log_" + moduleID + "").window({
            title: "查看日志", iconCls: "icon-search",
            onClose: function () {
                $(this).dialog('destroy');
            },
            onResize: function () {
                var height = $("#edit_Win_log_" + moduleID).height();
                if (!rid) {
                    height -= 38;
                }

                $("#dataList_log_panel_" + moduleID).css("height", height);
                $("#datalist_log_" + moduleID).datagrid("resize");
            }
        })

        $("#edit_Win_log_" + moduleID + "").window('open');
    }

    logSearch = function (moduleID) {
        $("#datalist_log_" + moduleID + "").datagrid("load", {
            ModuleID: moduleID,
            ResourceID: $("#search_RelationID_log_" + moduleID).val(),
        });
    }


}).call(this);


$(function () {

    return $('body').layout('panel', 'west').panel('refresh');
    
    //setTimeout(function () {
        
    //    return $('body').layout('panel', 'west').panel('refresh');

    //}, 200);

})