/**
 * Copyright (C) 2013-2014 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/module/admin/service/vdr/window/Scan.js")

/**
 * @class OMV.module.admin.service.vdr.Settings
 * @derived OMV.workspace.grid.Panel
 */
Ext.define("OMV.module.admin.service.vdr.Channels", {
    extend   : "OMV.workspace.grid.Panel",
    requires : [
        "OMV.Rpc",
        "OMV.data.Store",
        "OMV.data.Model",
        "OMV.data.proxy.Rpc",
        "Ext.grid.plugin.DragDrop",
        "Ext.grid.column.RowNumberer",
        "OMV.module.admin.service.vdr.window.Scan"
    ],
    uses : [
        "OMV.window.MessageBox"
    ],

    viewConfig : {
        plugins : {
            ptype : "gridviewdragdrop"
        },
        listeners : {
            drop : function (node, data) {
                data.view.refresh();
            }
        }
    },

    hideAddButton       : true,
    hideEditButton      : true,
    hideUpButton        : false,
    hideDownButton      : false,
    hideApplyButton     : false,
    hideRefreshButton   : false,
    mode                : "local",

    columns         : [{
        xtype: "rownumberer"
    },{
        text      : _("Channel Name"),
        sortable  : false,
        dataIndex : "channelName"
    },{
        text      : _("Channel Company"),
        sortable  : false,
        dataIndex : "channelCompany"
    },{
        text      : _("Encrypted"),
        sortable  : false,
        dataIndex : "channelEncrypted",
        renderer  : function(value) {
            return value ? "Yes" : "No";
        }
    }],

    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            store : Ext.create("OMV.data.Store", {
                autoLoad : true,
                model    : OMV.data.Model.createImplicit({
                    idProperty : "channel",
                    fields     : [{
                        name : "channel",
                        type : "string"
                    },{
                        name : "channelGroup",
                        type : "string"
                    },{
                        name : "channelName",
                        type : "string"
                    },{
                        name : "channelCompany",
                        type : "string"
                    },{
                        name : "channelEncrypted",
                        type : "boolean"
                    }]

                }),
                proxy    : {
                    type    : "rpc",
                    rpcData : {
                        service : "VDR",
                        method  : "getChannels"
                    }
                }
            })
        });

        me.callParent(arguments);
    },

    getTopToolbarItems : function() {
        var me = this;
        var items = me.callParent(arguments);

        Ext.Array.push(items, [{
            xtype: "tbseparator"
        },{
            id      : me.getId() + "-scan",
            xtype   : "button",
            text    : _("Scan"),
            icon    : "images/search.png",
            iconCls : Ext.baseCSSPrefix + "btn-icon-16x16",
            handler : Ext.Function.bind(me.onScanButton, me, [ me ]),
            scope   : me
        },{
            id      : me.getId() + "-scan-status",
            xtype   : "button",
            text    : _("Scan status"),
            icon    : "images/info.png",
            iconCls : Ext.baseCSSPrefix + "btn-icon-16x16",
            handler : Ext.Function.bind(me.onScanStatusButton, me, [ me ]),
            scope   : me
        }]);

        return items;
    },

    afterMoveRows : function(records, index) {
        var me = this;
        var sm = me.getSelectionModel();

        sm.select(records);
        me.view.refresh();
    },

    doReload : function() {
        var me = this;

        me.store.reload();
    },

    onApplyButton : function() {
        var me = this;
        var msg = "Do you really want to apply the configuration? Note: VDR will be restarted to apply the configuration. Active recordings will be temporarily paused.";

        OMV.MessageBox.show({
            title   : _("Confirmation"),
            msg     : msg,
            buttons : Ext.Msg.YESNO,
            fn      : function(answer) {
                if (answer == "no") {
                    me.doReload();
                    return;
                }

                me.startApply();
            },
            scope : me,
            icon  : Ext.Msg.QUESTION
        });
    },

    startApply : function() {
        var me = this;
        var rpcData = [];
        var records = me.store.getRange();

        for (var i = 0; i < records.length; i++) {
            rpcData.push(records[i].data);
        }

        var rpcOptions = {
            scope       : me,
            callback    : me.onApply,
            relayErrors : true,
            rpcData     : {
                service : "VDR",
                method  : "setChannels",
                params  : {
                    channels : rpcData
                }
            }
        };

        // Display waiting dialog.
        OMV.MessageBox.wait(null, _("Saving ..."));

        // Execute RPC.
        OMV.Rpc.request(rpcOptions);
    },

    onApply: function(id, success, response) {
        var me = this;

        OMV.MessageBox.updateProgress(1);
        OMV.MessageBox.hide();

        if (!success) {
            OMV.MessageBox.error(null, response);
        } else {
            OMV.MessageBox.success(null, _("The changes have been applied successfully."));
            me.doReload();
        }
    },

    onScanButton : function() {
        var me = this;

        OMV.Rpc.request({
            scope    : me,
            callback : me.onScan,
            rpcData  : {
                service : "VDR",
                method  : "vdrIsRunning"
            }
        });
    },

    onScan : function(id, success, response) {
        if (!response && success) {
            Ext.create("OMV.module.admin.service.vdr.window.Scan").show();
        } else {
            OMV.MessageBox.error(null, _("Can't perform a channel scan while VDR is still running, disable VDR andr try again."));
        }
    },

    onScanStatusButton : function() {
        var me = this;

        OMV.Rpc.request({
            scope    : me,
            callback : me.onScanStatus,
            rpcData  : {
                service : "VDR",
                method  : "scanInProgress"
            }
        });
    },

    onScanStatus : function(id, success, response) {
        var me = this;

        if (!success) {
            OMV.MessageBox.error(null, response);
        } else {
            var msg = response ? "Channel scan is still running."
                : "Channel Scan is not active.";

            OMV.MessageBox.info(null, msg);
        }
    }
});


OMV.WorkspaceManager.registerPanel({
    id        : "channels",
    path      : "/service/vdr",
    text      : _("Manage channels"),
    position  : 20,
    className : "OMV.module.admin.service.vdr.Channels"
});
