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
	uses: [
		"OMV.window.MessageBox"
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
    //stateful          : true,
    //stateId           : "9889057b-b2c0-4c48-a4c1-8c9b4fb51234",

    columns         : [{
        xtype: "rownumberer"
    },{
        text      : _("Channel"),
        sortable  : false,
        dataIndex : "channel"
    }],

    initComponent : function () {
        var me = this;
        me.mode = "local";

        Ext.apply(me, {
            store : Ext.create("OMV.data.Store", {
                autoLoad : true,
                storeId : "jee",
                model    : OMV.data.Model.createImplicit({
                    idProperty : "channel",
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

    afterDeletion : function() {
        var me = this;
        me.view.refresh();
    },

	afterMoveRows : function(records, index) {
        var me = this;
		var sm = me.getSelectionModel();
		sm.select(records);
        me.view.refresh();
	},

	onApplyButton : function() {
        var me = this;

        var rpcarr =[];
        var arr =[];
        arr = me.getStore().data.getRange();

        for(var i = 0; i < arr.length; i++){
            rpcarr[i] = arr[i].data.channel.toString();
        }

		var rpcOptions = {
			scope       : me,
			callback    : me.onApply,
			relayErrors : true,
			rpcData     : {
				    service : "VDR",
				    method  : "setChannels",
				    params  : { channels : rpcarr }
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
		if(!success) {
			//me.fireEvent("exception", me, response);
			OMV.MessageBox.error(null, response);
		} else {
			//var values = me.getRpcSetParams();
			//me.fireEvent("submit", me, values, response);
			OMV.MessageBox.success(null, _("The changes have been applied successfully."));
			me.store.reload();//me.doReload();
		}
	}

});


OMV.WorkspaceManager.registerPanel({
    id        : "channels",
    path      : "/service/vdr",
    text      : _("Channels"),
    position  : 20,
    className : "OMV.module.admin.service.vdr.Channels"
});
