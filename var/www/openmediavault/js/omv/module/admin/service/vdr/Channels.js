/**
 * Copyright (C) 2013 OpenMediaVault Plugin Developers
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
        "Ext.grid.column.RowNumberer"
    ],

    viewConfig : {
        plugins : {
            ptype : "gridviewdragdrop"
        },
        listeners : {
            drop : function (node, data) {data.view.refresh();}
        }
    },

	hideAddButton   : true,
	hideEditButton  : true,
    hideUpButton    : false,
    hideDownButton  : false,
    hideApplyButton : false,
    stateful        : false,

    columns         : [{
        xtype: "rownumberer"
    },{
        text      : _("Channel"),
        sortable  : false,
        dataIndex : "channel"
    }],

    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            store : Ext.create("OMV.data.Store", {
                autoLoad : true,
                model    : OMV.data.Model.createImplicit({
                    idProperty : "uuid",
                    fields     : [{
                        name : "channel",
                        type : "string"
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

	onApplyButton: function() {
		
	}



});


OMV.WorkspaceManager.registerPanel({
    id        : "channels",
    path      : "/service/vdr",
    text      : _("Channels"),
    position  : 20,
    className : "OMV.module.admin.service.vdr.Channels"
});
