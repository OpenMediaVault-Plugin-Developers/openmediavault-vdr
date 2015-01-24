/**
 * Copyright (C) 2013-2015 OpenMediaVault Plugin Developers
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
        align: "center",
        width: 60,
        resizable: false,
        trueIcon: "switch_on.png",
        falseIcon: "switch_off.png"
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
    }),

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
        }]);

        return items;
    },

    afterMoveRows: function(records, index) {
        var sm = this.getSelectionModel();

        sm.select(records);
        this.view.refresh();
    },

    // Override to make it work as it does in remote mode.
    doReload: function() {
        this.store.reload();
    },

    onApplyButton: function() {
        this.doSubmit();
    },

    doSubmit: function() {
        var rpcOptions = {
            scope: this,
            callback: this.onSubmit,
            relayErrors: true,
            rpcData: {
                service: "Vdr",
                method: "setChannels",
                params: this.getRpcSetParams()
            }
        };

        this.mask(_("Saving ..."));

        OMV.Rpc.request(rpcOptions);
    },

    onSubmit: function(id, success, response) {
        this.unmask();

        if (!success) {
            OMV.MessageBox.error(null, response);
        }
    },

    onScanButton: function() {
        Ext.create("OMV.module.admin.service.vdr.window.Scan").show();
    },

    getRpcSetParams: function() {
        var channels = [];
        var records = this.store.getRange();

        for (var i = 0; i < records.length; i++) {
            channels.push(records[i].data);
        }

        return {
            channels: channels
        };
    }
});


OMV.WorkspaceManager.registerPanel({
    id: "channels",
    path: "/service/vdr",
    text: _("Channels"),
    position: 20,
    className: "OMV.module.admin.service.vdr.Channels"
});
