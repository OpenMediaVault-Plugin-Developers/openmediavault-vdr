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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/form/plugin/LinkedFields.js")
// require("js/omv/module/admin/service/vdr/stores/CountryCodeStore.js")
// require("js/omv/module/admin/service/vdr/stores/SatelliteCodeStore.js")

Ext.define("OMV.module.admin.service.vdr.window.Scan", {
    extend : "OMV.workspace.window.Form",

    requires : [
        "OMV.form.plugin.LinkedFields",
        "OMV.module.admin.service.vdr.stores.CountryCodeStore",
        "OMV.module.admin.service.vdr.stores.SatelliteCodeStore"
    ],

    rpcService   : "VDR",
    rpcGetMethod : "getScanSettings",
    rpcSetMethod : "setScanSettings",

    hideResetButton : true,
    title           : _("Scan"),

    plugins : [{
        ptype        : "linkedfields",
        correlations : [{
            conditions : [{
                name  : "transpondertype",
                value : "a"
            }],
            name       : [
                "atsc_fieldset"
            ],
            properties : "show"
        },{
            conditions : [{
                name  : "transpondertype",
                value : "t"
            }],
            name       : [
                "terrestial_fieldset"
            ],
            properties : "show"
        },{
            conditions : [{
                name  : "transpondertype",
                value : "c"
            }],
            name       : ["cable_fieldset"],
            properties : "show"
        },{
            conditions : [{
                name  : "transpondertype",
                value : "s"
            }],
            name       : [
                "satellite_fieldset"
            ],
            properties : "show"
        }]
    }],

    getFormItems : function() {
        var me = this;

        return [{
            xtype         : "fieldset",
            title         : _("Scan settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "combo",
                name       : "transpondertype",
                fieldLabel : "Transponder Type",
                allowBlank : false,
                editable   : false,
                store : [
                    ["a", "ATSC"],
                    ["t", "DVB-T (Terrestial)"],
                    ["c", "DVB-C (Cable)"],
                    ["s", "DVB-S (Satellite)"]
                ],
                mode          : "local",
                triggerAction : "all",
                selectOnFocus : true
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
                    name       : "atsc_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "atsc_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore"),
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : "local",
                    mode           : "local",
                    triggerAction  : "all",
                    selectOnFocus  : true
                },{
                    xtype      : "combo",
                    name       : "atsc_type",
                    fieldLabel : "Transponder Type",
                    allowBlank : false,
                    editable   : false,
                    store      : [
                        ["1", "Terrestial"],
                        ["2", "Cable"],
                        ["3", "Terrestial and Cable"]
                    ],
                    mode          : "local",
                    triggerAction : "all",
                    selectOnFocus : true,
                    value         : "1"
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
                    name       : "dvb_t_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "dvb_t_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore"),
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : "local",
                    mode           : "local",
                    triggerAction  : "all",
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
                    name       : "dvb_c_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "dvb_c_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore"),
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : "local",
                    mode           : "local",
                    triggerAction  : "all",
                    selectOnFocus  : true
                },{
                    xtype         : "combo",
                    name          : "dvb_c_qam",
                    fieldLabel    : "Modulation",
                    allowBlank    : true,
                    editable      : false,
                    store         : [
                        [" ", "Not Used"],
                        ["0", "QAM64"],
                        ["1", "QAM256"],
                        ["2", "QAM128"]
                    ],
                    mode          : "local",
                    triggerAction : "all",
                    selectOnFocus : true
                },{
                    xtype      : "combo",
                    name       : "dvb_c_symbolrate",
                    fieldLabel : "Symbol rate",
                    allowBlank : true,
                    editable   : false,
                    store      : [
                        [" ", "Not Used"],
                        ["0", "6900"],
                        ["1", "6875"],
                        ["2", "6111"],
                        ["3", "6250"],
                        ["4", "6790"],
                        ["5", "6811"],
                        ["6", "5900"],
                        ["7", "5000"],
                        ["8", "3450"],
                        ["9", "4000"],
                        ["10", "6950"],
                        ["11", "7000"],
                        ["12", "6952"],
                        ["13", "5156"],
                        ["14", "4583"]
                    ],
                    mode          : "local",
                    triggerAction : "all",
                    selectOnFocus : true
                },{
                    xtype      : "checkbox",
                    name       : "dvb_c_extended_qam",
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
                    name       : "dvb_s_scan_encrypted",
                    fieldLabel : _("Encrypted Channels"),
                    boxLabel   : "Check to scan for encrypted channels. If Syslog starts to fill up disable this.",
                    checked    : false
                },{
                    xtype          : "combo",
                    name           : "dvb_s_country",
                    fieldLabel     : "Country",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore"),
                    displayField   : "country",
                    valueField     : "abbr",
                    queryMode      : "local",
                    mode           : "local",
                    triggerAction  : "all",
                    selectOnFocus  : true
                },{
                    xtype          : "combo",
                    name           : "dvb_s_satellite",
                    fieldLabel     : "Satellite",
                    allowBlank     : true,
                    editable       : true,
                    forceSelection : true,
                    store          : Ext.create("OMV.module.admin.service.vdr.stores.SatelliteCodeStore"),
                    displayField   : "satellite",
                    valueField     : "abbr",
                    queryMode      : "local",
                    mode           : "local",
                    triggerAction  : "all",
                    selectOnFocus  : true
                }]
            }]
        }];
    },

    getButtonItems : function(c) {
        var me = this;
        var items = me.callParent(arguments);

        Ext.Array.insert(items, 0, [{
            id      : me.getId() + "-scan",
            xtype   : "button",
            text    : _("Save and scan"),
            handler : Ext.Function.bind(me.onScanButton, me, [ me ]),
            scope   : me
        }]);

        return items;
    },

    onScanButton : function() {
        var me = this;

        if (!me.isValid()) {
            me.markInvalid();
        } else {

            me.on("submit", me.doScan, me, {
                single : true
            });

            me.on("exception", function() {
                me.un("submit", me.doScan);
            });

            me.doSubmit();
        }
    },

    doScan : function() {
        var me = this;
        var msg = "Channel Scan Started. Scanning can take over 30 minutes. There is no feedback when the scan is complete. Use the 'Scan Status' button to check when you can enable VDR.";

        OMV.Rpc.request({
            scope   : me,
            rpcData : {
                service : "VDR",
                method  : "scanChannels",
                params  : me.getRpcGetParams()
            }
        });

        OMV.MessageBox.info(null, msg);
    }
});
