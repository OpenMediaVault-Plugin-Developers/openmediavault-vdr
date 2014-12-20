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

Ext.define("OMV.module.admin.service.vdr.Channels", {
    extend: "OMV.workspace.grid.Panel",
    requires: [
        "OMV.Rpc",
        "OMV.data.Store",
        "OMV.data.Model",
        "OMV.data.proxy.Rpc",
        "Ext.grid.plugin.DragDrop",
        "Ext.grid.column.RowNumberer",
        "OMV.module.admin.service.vdr.window.Scan"
    ],
    uses: [
        "OMV.window.MessageBox"
    ],

    hideAddButton: true,
    hideEditButton: true,
    hideUpButton: false,
    hideDownButton: false,
    hideApplyButton: false,
    hideRefreshButton: false,
    mode: "local",

    columns: [{
        xtype: "rownumberer"
    }, {
        text: _("Name"),
        sortable: false,
        dataIndex: "name",
        flex: 1
    }, {
        text: _("Company"),
        sortable: false,
        dataIndex: "company",
        flex: 1
    }, {
        xtype: "booleaniconcolumn",
        text: _("Encrypted"),
        sortable: false,
        dataIndex: "encrypted",
        align : "center",
        width : 60,
        resizable : false,
        trueIcon : "switch_on.png",
        falseIcon : "switch_off.png"
    }],

    viewConfig: {
        plugins: {
            ptype: "gridviewdragdrop"
        },
        listeners: {
            drop: function(node, data) {
                data.view.refresh();
            }
        }
    },

    initComponent: function() {
        Ext.apply(this, {
            store: Ext.create("OMV.data.Store", {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: "channel",
                    fields: [{
                        name: "channel",
                        type: "string"
                    }, {
                        name: "group",
                        type: "string"
                    }, {
                        name: "name",
                        type: "string"
                    }, {
                        name: "company",
                        type: "string"
                    }, {
                        name: "encrypted",
                        type: "boolean"
                    }]

                }),
                proxy: {
                    type: "rpc",
                    rpcData: {
                        service: "Vdr",
                        method: "getChannels"
                    }
                }
            })
        });

        this.callParent(arguments);
    },

    getTopToolbarItems: function() {
        var items = this.callParent(arguments);

        Ext.Array.push(items, [{
            xtype: "tbseparator"
        }, {
            id: this.getId() + "-scan",
            xtype: "button",
            text: _("Scan"),
            icon: "images/search.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            handler: Ext.Function.bind(this.onScanButton, this),
            scope: this
        }, {
            id: this.getId() + "-scan-status",
            xtype: "button",
            text: _("Scan status"),
            icon: "images/info.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            handler: Ext.Function.bind(this.onScanStatusButton, this),
            scope: this
        }]);

        return items;
    },

    afterMoveRows: function(records, index) {
        var sm = this.getSelectionModel();

        sm.select(records);
        this.view.refresh();
    },

    doReload: function() {
        this.store.reload();
    },

    onApplyButton: function() {
        var msg = "Do you really want to apply the configuration? Note: VDR will be restarted to apply the configuration. Active recordings will be temporarily paused.";

        OMV.MessageBox.show({
            title: _("Confirmation"),
            msg: msg,
            buttons: Ext.Msg.YESNO,
            fn: function(answer) {
                if (answer == "no") {
                    this.doReload();
                    return;
                }

                this.startApply();
            },
            scope: this,
            icon: Ext.Msg.QUESTION
        });
    },

    startApply: function() {
        var rpcData = [];
        var records = this.store.getRange();

        for (var i = 0; i < records.length; i++) {
            rpcData.push(records[i].data);
        }

        var rpcOptions = {
            scope: this,
            callback: this.onApply,
            relayErrors: true,
            rpcData: {
                service: "Vdr",
                method: "setChannels",
                params: {
                    channels: rpcData
                }
            }
        };

        // Display waiting dialog.
        OMV.MessageBox.wait(null, _("Saving ..."));

        // Execute RPC.
        OMV.Rpc.request(rpcOptions);
    },

    onApply: function(id, success, response) {
        OMV.MessageBox.updateProgress(1);
        OMV.MessageBox.hide();

        if (!success) {
            OMV.MessageBox.error(null, response);
        } else {
            OMV.MessageBox.success(null, _("The changes have been applied successfully."));
            this.doReload();
        }
    },

    onScanButton: function() {
        OMV.Rpc.request({
            scope: this,
            callback: this.onScan,
            rpcData: {
                service: "Vdr",
                method: "isRunning"
            }
        });
    },

    onScan: function(id, success, response) {
        if (!response && success) {
            Ext.create("OMV.module.admin.service.vdr.window.Scan").show();
        } else {
            OMV.MessageBox.error(null, _("Can't perform a channel scan while VDR is still running, disable VDR andr try again."));
        }
    },

    onScanStatusButton: function() {
        OMV.Rpc.request({
            scope: this,
            callback: this.onScanStatus,
            rpcData: {
                service: "Wscan",
                method: "scanning"
            }
        });
    },

    onScanStatus: function(id, success, response) {
        if (!success) {
            OMV.MessageBox.error(null, response);
        } else {
            var msg = response ? "Channel scan is still running." : "Channel Scan is not active.";

            OMV.MessageBox.info(null, msg);
        }
    }
});


OMV.WorkspaceManager.registerPanel({
    id: "channels",
    path: "/service/vdr",
    text: _("Channels"),
    position: 20,
    className: "OMV.module.admin.service.vdr.Channels"
});
