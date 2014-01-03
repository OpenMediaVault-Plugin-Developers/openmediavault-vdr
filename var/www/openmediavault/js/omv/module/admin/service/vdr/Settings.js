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

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/form/field/SharedFolderComboBox.js")
// require("js/omv/module/admin/service/vdr/stores/CountryCodeStore.js")
// require("js/omv/module/admin/service/vdr/stores/SatelliteCodeStore.js")

/**
 * @class OMV.module.admin.service.vdr.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.vdr.Settings", {
    extend : "OMV.workspace.form.Panel",

    requires : [
        "OMV.data.Store",
        "OMV.data.Model",
        "OMV.module.admin.service.vdr.stores.CountryCodeStore",
        "OMV.module.admin.service.vdr.stores.SatelliteCodeStore"
    ],

    rpcService   : "VDR",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    plugins : [{
        ptype        : "linkedfields",
        correlations : [{
            conditions : [{
                name  : "vdr_enable",
                value : true
            }],
            name       : [
                "vdr_scanbutton"
            ],
            properties : "disabled"
        },{
            conditions : [{
                name  : "vdr_transpondertype",
                value : "a"
            }],
            name       : [
                "atsc_fieldset"
            ],
            properties : "show"
        },{
            conditions : [{
                name  : "vdr_transpondertype",
                value : "t"
            }],
            name       : [
                "terrestial_fieldset"
            ],
            properties : "show"
        },{
            conditions : [{
                name  : "vdr_transpondertype",
                value : "c"
            }],
            name       : ["cable_fieldset"],
            properties : "show"
        },{
            conditions : [{
                name  : "vdr_transpondertype",
                value : "s"
            }],
            name       : [
                "satellite_fieldset"
            ],
            properties : "show"
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

    initComponent : function() {
        var me = this;

        // Country Codes
        Ext.apply(me, {
            store : Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore", {
                storeId : "countrycode"
            })
        });

        // Satellite Codes
        Ext.apply(me, {
            store : Ext.create("OMV.module.admin.service.vdr.stores.SatelliteCodeStore", {
                storeId : "satellitecode"
            })
        });

        me.callParent(arguments);
    },

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
                fieldLabel : _("Full Log"),
                checked    : false,
                boxLabel   : _("Enable logging of all VDR actions to SysLog.")
            },{
                xtype      : "combo",
                name       : "vdr_transpondertype",
                fieldLabel : "Transponder Type",
                allowBlank : false,
                editable   : false,
                store : [
                    ['a', 'ATSC'],
                    ['t', 'DVB-T (Terrestial)'],
                    ['c', 'DVB-C (Cable)'],
                    ['s', 'DVB-S (Satellite)']
                ],
                mode          : 'local',
                triggerAction : 'all',
                selectOnFocus : true
            },{
                xtype       : "button",
                name        : "vdr_checkdevicesbutton",
                text        : _("Check for Connected Devices"),
                handler     : Ext.Function.bind(me.onCheckDevicesButton, me, [me]),
                scope       : me,
                style       : {
                    marginTop       : "10px",
                    marginBottom    : "10px"
                }
            },{
                xtype         : "fieldset",
                id            : "atsc_fieldset",
                title         : _("ATSC Transponder settings"),
                fieldDefaults : {
                    labelSeparator : ""
                },
                hidden : true,
                items  : [{
                    xtype      : "checkbox",
                    name       : "vdr_atsc_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "vdr_atsc_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : "countrycode",
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : 'local',
                    mode           : 'local',
                    triggerAction  : 'all',
                    selectOnFocus  : true
                },{
                    xtype      : "combo",
                    name       : "vdr_atsc_type",
                    fieldLabel : "Transponder Type",
                    allowBlank : false,
                    editable   : false,
                    store : [
                        ['1', 'Terrestial'],
                        ['2', 'Cable'],
                        ['3', 'Terrestial and Cable']
                    ],
                    mode          : 'local',
                    triggerAction : 'all',
                    selectOnFocus : true
                }]
            },{
                xtype         : "fieldset",
                id            : "terrestial_fieldset",
                title         : _("DVB-T Transponder settings"),
                fieldDefaults : {
                    labelSeparator : ""
                },
                hidden : true,
                items  : [{
                    xtype      : "checkbox",
                    name       : "vdr_dvb_t_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "vdr_dvb_t_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : "countrycode",
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : 'local',
                    mode           : 'local',
                    triggerAction  : 'all',
                    selectOnFocus  : true
                }]
            },{
                xtype         : "fieldset",
                id            : "cable_fieldset",
                title         : _("DVB-C Transponder settings"),
                fieldDefaults : {
                    labelSeparator : ""
                },
                hidden : true,
                items  : [{
                    xtype      : "checkbox",
                    name       : "vdr_dvb_c_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "vdr_dvb_c_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : "countrycode",
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : 'local',
                    mode           : 'local',
                    triggerAction  : 'all',
                    selectOnFocus  : true
                },{
                    xtype         : "combo",
                    name          : "vdr_dvb_c_qam",
                    fieldLabel    : "Modulation",
                    allowBlank    : true,
                    editable      : false,
                    store         : [
                        [' ', 'Not Used'],
                        ['0', 'QAM64'],
                        ['1', 'QAM256'],
                        ['2', 'QAM128']
                    ],
                    mode          : 'local',
                    triggerAction : 'all',
                    selectOnFocus : true
                },{
                    xtype      : "combo",
                    name       : "vdr_dvb_c_symbolrate",
                    fieldLabel : "Symbol rate",
                    allowBlank : true,
                    editable   : false,
                    store      : [
                        [' ', 'Not Used'],
                        ['0', '6900'],
                        ['1', '6875'],
                        ['2', '6111'],
                        ['3', '6250'],
                        ['4', '6790'],
                        ['5', '6811'],
                        ['6', '5900'],
                        ['7', '5000'],
                        ['8', '3450'],
                        ['9', '4000'],
                        ['10', '6950'],
                        ['11', '7000'],
                        ['12', '6952'],
                        ['13', '5156'],
                        ['14', '4583']
                    ],
                    mode          : 'local',
                    triggerAction : 'all',
                    selectOnFocus : true
                },{
                    xtype      : "checkbox",
                    name       : "vdr_dvb_c_extended_qam",
                    fieldLabel : _("Extended QAM scan"),
                    boxLabel   : "(Enable QAM128) recommended for Nethterlands and Finland",
                    checked    : false
                }]
            },{
                xtype         : "fieldset",
                name          : "satellite_fieldset",
                title         : _("DVB-S Transponder settings"),
                fieldDefaults : {
                    labelSeparator : ""
                },
                hidden : true,
                items  : [{
                    xtype      : "checkbox",
                    name       : "vdr_dvb_s_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "vdr_dvb_s_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : "countrycode",
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : 'local',
                    mode           : 'local',
                    triggerAction  : 'all',
                    selectOnFocus  : true
                },{
                    xtype          : "combo",
                    name           : "vdr_dvb_s_satellite",
                    fieldLabel     : "Satellite",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : "satellitecode",
                    displayField   : "satellite",
                    valueField     : "abbr",
                    queryMode      : 'local',
                    mode           : 'local',
                    triggerAction  : 'all',
                    selectOnFocus  : true
                }]
            },{
                xtype   : "button",
                name    : "vdr_scanbutton",
                text    : _("Scan Channels"),
                handler : Ext.Function.bind(me.onScanButton, me, [me]),
                scope   : me
            },{
                xtype : "text",
                id    : "vdr_initialscan_notdone",
                text  : "NOTE! Disable VDR to enable scanning.",
                style : {
                    textDecoration : "underline",
                    fontWeight     : "bold",
                    fontSize       : "110%",
                    paddingBottom  : "5px",
                    paddingLeft    : "10px",
                    paddingRight   : "10px"
                }
            },{
                xtype   : "button",
                name    : "vdr_scanstatusbutton",
                text    : _("Scan Status"),
                handler : Ext.Function.bind(me.onScanStatusButton, me, [me]),
                scope   : me
            },{
                xtype      : "sharedfoldercombo",
                name       : "vdr_recordingdir",
                fieldLabel : "Recording directory",
                allowBlank : true
            },{
                xtype         : "numberfield",
                name          : "vdr_maxfilesize_gb",
                fieldLabel    : "Maximum filesize in GB",
                minValue      : 1,
                allowDecimals : false,
                allowBlank    : false
            },{
                xtype      : "checkbox",
                name       : "vdr_subtitles",
                fieldLabel : _("Use Subtitles"),
                checked    : false
            },{
                xtype      : "textfield",
                name       : "vdr_subtitle_languages",
                fieldLabel : "Subtitle language(s)"
            },{
                xtype      : "textfield",
                name       : "vdr_epglanguage",
                fieldLabel : "EPG language"
            },{
                xtype      : "combo",
                name       : "vdr_channelupdatemode",
                fieldLabel : "Channel Update Mode",
                allowBlank : false,
                editable   : false,
                store      : [
                    ['0', '0 No update'],
                    ['1', '1 Only Channel Names'],
                    ['2', '2 Only Channel PIDs'],
                    ['3', '3 Channel Names and PIDs'],
                    ['4', '4 All updates and add newly found channels'],
                    ['5', '5 All updates, new channels and add new transponders']
                ],
                mode          : 'local',
                triggerAction : 'all',
                selectOnFocus : true
            }]
        },{ /* VDR-plugin-streamdev-server */
            xtype         : "fieldset",
            title         : _("VDR-plugin-streamdev-server"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "vdr_streamdev_enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype         : "numberfield",
                name          : "vdr_streamdev_port",
                fieldLabel    : "Port Number",
                minValue      : 0,
                allowDecimals : false,
                allowBlank    : true,
                value         : 3000
            }]
        },{ /* VDR-plugin-live */
            xtype         : "fieldset",
            title         : _("VDR-plugin-live"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "vdr_live_enable",
                fieldLabel : _("Enable"),
                checked    : false
            }]
        },{ /* VDRAdmin-AM */
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
                fieldLabel    : "Port Number",
                minValue      : 0,
                allowDecimals : false,
                allowBlank    : true
            }]
        }];
    },

    onVdradminamButton : function() {
        var me = this;
        window.open("http://" + window.location.hostname + ":" + me.getForm().findField("vdradminam_port").getValue(), "_blank");

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
            var msg;
            msg = "Number of detected devices: " + response;
            OMV.MessageBox.info(null, msg);
        }
    },

    onScanButton : function() {
        var me = this;

        OMV.Rpc.request({
            scope   : me,
            rpcData : {
                service : "VDR",
                method  : "scanChannels",
                params  : {
                    vdr_transpondertype : me.getForm().findField("vdr_transpondertype").getValue(),
                    vdr_atsc_country : me.getForm().findField("vdr_atsc_country").getValue(),
                    vdr_atsc_type : me.getForm().findField("vdr_atsc_type").getValue(),
                    vdr_atsc_scan_encrypted : me.getForm().findField("vdr_atsc_scan_encrypted").getValue(),
                    vdr_dvb_t_country : me.getForm().findField("vdr_dvb_t_country").getValue(),
                    vdr_dvb_t_scan_encrypted : me.getForm().findField("vdr_dvb_t_scan_encrypted").getValue(),
                    vdr_dvb_c_country : me.getForm().findField("vdr_dvb_c_country").getValue(),
                    vdr_dvb_c_qam : me.getForm().findField("vdr_dvb_c_qam").getValue(),
                    vdr_dvb_c_symbolrate : me.getForm().findField("vdr_dvb_c_symbolrate").getValue(),
                    vdr_dvb_c_extended_qam : me.getForm().findField("vdr_dvb_c_extended_qam").getValue(),
                    vdr_dvb_c_scan_encrypted : me.getForm().findField("vdr_dvb_c_scan_encrypted").getValue(),
                    vdr_dvb_s_country : me.getForm().findField("vdr_dvb_s_country").getValue(),
                    vdr_dvb_s_satellite : me.getForm().findField("vdr_dvb_s_satellite").getValue(),
                    vdr_dvb_s_scan_encrypted : me.getForm().findField("vdr_dvb_s_scan_encrypted").getValue()
                }
            }
        });

        var msg = 'Channel Scan Started. Scanning can take over 30 minutes. There is no feedback when the scan is complete. Use the "Scan Status" button to check when you can enable VDR.';

        OMV.MessageBox.info(null, msg);
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
    id        : "settings",
    path      : "/service/vdr",
    text      : _("VDR Settings"),
    position  : 10,
    className : "OMV.module.admin.service.vdr.Settings"
});
