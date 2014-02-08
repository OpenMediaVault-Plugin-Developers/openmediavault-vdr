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
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/form/field/SharedFolderComboBox.js")

/**
 * @class OMV.module.admin.service.vdr.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.vdr.Settings", {
    extend : "OMV.workspace.form.Panel",

    requires : [
        "OMV.data.Store",
        "OMV.data.Model"
    ],

    rpcService   : "VDR",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    plugins : [{
        ptype        : "linkedfields",
        correlations : [{
            conditions : [{
                name  : "vdr_streamdev_enable",
                value : true
            }],
            name       : [
                "vdr_streamdev_linkbutton"
            ],
            properties : "enabled"
        },{
            conditions : [{
                name  : "vdr_live_enable",
                value : true
            }],
            name       : [
                "vdr_live_linkbutton"
            ],
            properties : "enabled"
        },{
            conditions : [{
                name  : "vdradminam_enable",
                value : true
            }],
            name       : [
                "vdradminam_linkbutton"
            ],
            properties : "enabled"
        }]
    }],

    getFormItems : function() {
        var me = this;

        return [{
            xtype         : "fieldset",
            title         : _("VDR settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "vdr_enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "checkbox",
                name       : "vdr_logging_on",
                fieldLabel : _("Full log"),
                checked    : false,
                boxLabel   : _("Enable logging of all VDR actions to syslog.")
            },{
                xtype      : "sharedfoldercombo",
                name       : "vdr_recordingdir",
                fieldLabel : _("Recording directory"),
                allowBlank : true
            },{
                xtype         : "numberfield",
                name          : "vdr_maxfilesize_gb",
                fieldLabel    : _("Maximum filesize in GB"),
                minValue      : 1,
                allowDecimals : false,
                allowBlank    : false
            },{
                xtype      : "checkbox",
                name       : "vdr_subtitles",
                fieldLabel : _("Use subtitles"),
                checked    : false
            },{
                xtype      : "textfield",
                name       : "vdr_subtitle_languages",
                fieldLabel : _("Subtitle language(s)")
            },{
                xtype      : "textfield",
                name       : "vdr_epglanguage",
                fieldLabel : _("EPG language")
            },{
                xtype      : "combo",
                name       : "vdr_channelupdatemode",
                fieldLabel : _("Channel update mode"),
                allowBlank : false,
                editable   : false,
                store      : [
                    ["0", _("No update")],
                    ["1", _("Only Channel Names")],
                    ["2", _("Only Channel PIDs")],
                    ["3", _("Channel Names and PIDs")],
                    ["4", _("All updates and add newly found channels")],
                    ["5", _("All updates, new channels and add new transponders")]
                ],
                mode          : "local",
                triggerAction : "all",
                selectOnFocus : true
            },{
                xtype : "button",
                name : "vdr_checkdevicesbutton",
                text : _("Check for connected devices"),
                handler : Ext.Function.bind(me.onCheckDevicesButton, me, [me]),
                scope : me,
                style : {
                    marginTop : "10px",
                    marginBottom : "10px"
                }
            }]
        },{
            /* VDR-plugin-streamdev-server */
            xtype         : "fieldset",
            title         : _("VDR-plugin-streamdev-server"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype       : "button",
                name        : "vdr_streamdev_linkbutton",
                text        : _("Go to streamdev-server"),
                handler     : Ext.Function.bind(me.onVdrStreamdevButton, me, [me]),
                scope       : me,
                style       : {
                    marginTop       : "10px",
                    marginBottom    : "10px"
                }
            },{
                xtype      : "checkbox",
                name       : "vdr_streamdev_enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype         : "numberfield",
                name          : "vdr_streamdev_port",
                fieldLabel    : _("Port number"),
                minValue      : 0,
                allowDecimals : false,
                allowBlank    : true,
                value         : 3000
            },{
                xtype      : "textfield",
                name       : "vdr_streamdev_hosts",
                fieldLabel : _("Allowed hosts")
            }]
        },{
            /* VDR-plugin-live */
            xtype         : "fieldset",
            title         : _("VDR-plugin-live"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype       : "button",
                name        : "vdr_live_linkbutton",
                text        : _("Go to live"),
                handler     : Ext.Function.bind(me.onVdrLiveButton, me, [me]),
                scope       : me,
                style       : {
                    marginTop       : "10px",
                    marginBottom    : "10px"
                }
            },{
                xtype      : "checkbox",
                name       : "vdr_live_enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype         : "numberfield",
                name          : "vdr_live_port",
                fieldLabel    : _("Port number"),
                minValue      : 0,
                allowDecimals : false,
                allowBlank    : true,
                value         : 8008
            }]
        },{
            /* VDRAdmin-AM */
            xtype         : "fieldset",
            title         : _("VDRAdmin-AM settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype       : "button",
                name        : "vdradminam_linkbutton",
                text        : _("Go to VDRAdmin-AM"),
                handler     : Ext.Function.bind(me.onVdradminamButton, me, [me]),
                scope       : me,
                style       : {
                    marginTop       : "10px",
                    marginBottom    : "10px"
                }
            },{
                xtype      : "checkbox",
                name       : "vdradminam_enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype         : "numberfield",
                name          : "vdradminam_port",
                fieldLabel    : _("Port number"),
                minValue      : 0,
                allowDecimals : false,
                allowBlank    : true
            }]
        }];
    },

    onCheckDevicesButton : function() {
        var me = this;

        OMV.Rpc.request({
            scope    : me,
            callback : me.onCheckDevices,
            rpcData  : {
                service : "VDR",
                method  : "checkDevices"
            }
        });
    },

    onCheckDevices : function(id, success, response) {
        var me = this;

        if (!success) {
            OMV.MessageBox.error(null, response);
        } else {
            var msg = _("Number of detected devices: ") + response;
            OMV.MessageBox.info(null, msg);
        }
    },

    onVdrStreamdevButton : function() {
        var me = this;
        window.open("http://" + window.location.hostname + ":" + me.getForm().findField("vdr_streamdev_port").getValue(), "_blank");
    },

    onVdrLiveButton : function() {
        var me = this;
        window.open("http://" + window.location.hostname + ":" + me.getForm().findField("vdr_live_port").getValue(), "_blank");
    },

    onVdradminamButton : function() {
        var me = this;
        window.open("http://" + window.location.hostname + ":" + me.getForm().findField("vdradminam_port").getValue(), "_blank");
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/vdr",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.vdr.Settings"
});
