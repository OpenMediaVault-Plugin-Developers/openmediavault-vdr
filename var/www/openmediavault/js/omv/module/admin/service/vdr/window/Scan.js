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
    extend: "OMV.workspace.window.Form",

    requires: [
        "OMV.form.plugin.LinkedFields",
        "OMV.module.admin.service.vdr.stores.CountryCodeStore",
        "OMV.module.admin.service.vdr.stores.SatelliteCodeStore"
    ],

    hideResetButton: true,
    hideOkButton: true,
    title: _("Scan"),

    plugins: [{
        ptype: "linkedfields",
        correlations: [{
            conditions: [{
                name: "frontend_type",
                value: "a"
            }],
            name: ["atsc_type"],
            properties: ["enabled", "show"]
        }, {
            conditions: [{
                name: "frontend_type",
                value: "c"
            }],
            name: ["dvb_c_modulation", "dvb_c_symbol_rate", "dvb_c_extended_qam"],
            properties: ["enabled", "show"]
        }, {
            conditions: [{
                name: "frontend_type",
                value: "s"
            }],
            name: ["dvb_s_satellite"],
            properties: ["enabled", "show"]
        }]
    }],

    getFormItems: function() {
        return [{
            xtype: "fieldset",
            title: _("General"),
            fieldDefaults: {
                labelSeparator: ""
            },
            items: [{
                xtype: "combo",
                name: "frontend_type",
                fieldLabel: _("Frontend type"),
                store: [
                    ["a", _("ATSC")],
                    ["t", _("DVB-T (Terrestial)")],
                    ["c", _("DVB-C (Cable)")],
                    ["s", _("DVB-S (Satellite)")]
                ],
                allowBlank: false,
                editable: false,
                mode: "local",
                triggerAction: "all",
                value: "t"
            }, {
                xtype: "combo",
                name: "country",
                fieldLabel: _("Country"),
                store: Ext.create("OMV.module.admin.service.vdr.stores.CountryCodeStore"),
                allowBlank: false,
                displayField: "country",
                editable: true,
                forceSelection: true,
                queryMode: "local",
                triggerAction: "all",
                value: "t",
                valueField: "abbr"
            }]
        }, {
            xtype: "fieldset",
            title: _("Services"),
            fieldDefaults: {
                labelSeparator: ""
            },
            items: [{
                xtype: "checkbox",
                name: "include_radio_channels",
                fieldLabel: _("Radio channels"),
                checked: true
            }, {
                xtype: "checkbox",
                name: "include_tv_channels",
                fieldLabel: _("TV channels"),
                checked: true
            }, {
                xtype: "checkbox",
                name: "include_other_services",
                fieldLabel: _("Other services"),
                checked: false
            }, {
                xtype: "checkbox",
                name: "include_encrypted_channels",
                fieldLabel: _("Encrypted channels"),
                checked: true
            }]
        }, {
            xtype: "fieldset",
            title: _("Frontend specific"),
            fieldDefaults: {
                labelSeparator: ""
            },
            items: [{
                xtype: "combo",
                name: "atsc_type",
                fieldLabel: _("Transponder type"),
                store: [
                    [1, _("Terrestial")],
                    [2, _("Cable")],
                    [3, _("Terrestial and Cable")]
                ],
                allowBlank: false,
                disabled: true,
                editable: false,
                hidden: true,
                mode: "local",
                triggerAction: "all",
                value: 1
            }, {
                xtype: "combo",
                name: "dvb_c_modulation",
                fieldLabel: _("Modulation"),
                store: [
                    [-1, _("None")],
                    [0, "QAM64"],
                    [1, "QAM256"],
                    [2, "QAM128"]
                ],
                allowBlank: true,
                disabled: true,
                editable: false,
                hidden: true,
                mode: "local",
                triggerAction: "all",
                value: -1
            }, {
                xtype: "combo",
                name: "dvb_c_symbol_rate",
                fieldLabel: "Symbol rate",
                store: [
                    [-1, _("None")],
                    [0, "6900"],
                    [1, "6875"],
                    [2, "6111"],
                    [3, "6250"],
                    [4, "6790"],
                    [5, "6811"],
                    [6, "5900"],
                    [7, "5000"],
                    [8, "3450"],
                    [9, "4000"],
                    [10, "6950"],
                    [11, "7000"],
                    [12, "6952"],
                    [13, "5156"],
                    [14, "4583"]
                ],
                allowBlank: true,
                disabled: true,
                editable: false,
                hidden: true,
                mode: "local",
                triggerAction: "all",
                value: -1
            }, {
                xtype: "checkbox",
                name: "dvb_c_extended_qam",
                fieldLabel: _("Extended QAM scan"),
                boxLabel: _("Enable QAM128 (recommended for Nethterlands and Finland)."),
                checked: false,
                disabled: true,
                hidden: true
            }, {
                xtype: "combo",
                name: "dvb_s_satellite",
                fieldLabel: "Satellite",
                store: Ext.create("OMV.module.admin.service.vdr.stores.SatelliteCodeStore"),
                allowBlank: false,
                disabled: true,
                displayField: "satellite",
                editable: true,
                forceSelection: true,
                hidden: true,
                queryMode: "local",
                selectOnFocus: true,
                triggerAction: "all",
                valueField: "abbr"
            }]
        }];
    },

    getButtonItems: function(c) {
        var items = this.callParent(arguments);

        Ext.Array.insert(items, 0, [{
            id: this.getId() + "-scan",
            xtype: "button",
            text: _("Scan"),
            handler: Ext.Function.bind(this.onScanButton, this),
            scope: this
        }]);

        return items;
    },

    onScanButton: function() {
        if (!this.isValid()) {
            this.markInvalid();

            return;
        }

        this.close();
        this.doScan();
    },

    doScan: function() {
        var wnd = Ext.create("OMV.window.Execute", {
            title: _("Scanning for channels ..."),
            rpcService: "Wscan",
            rpcMethod: "scan",
            rpcParams: this.getRpcSetParams(),
            rpcIgnoreErrors: false,
            hideStartButton: true,
            hideStopButton: true,
            listeners: {
                scope: this,
                finish: function(wnd, response) {
                    wnd.appendValue(_("Done ..."));
                    wnd.setButtonDisabled("close", false);
                },
                exception: function(wnd, error) {
                    OMV.MessageBox.error(null, error);
                    wnd.setButtonDisabled("close", false);
                }
            }
        });

        wnd.setButtonDisabled("close", true);
        wnd.show();
        wnd.start();
    }
});
