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

/**
 * @class OMV.module.admin.service.vdr.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.vdr.Info", {
    extend : "OMV.workspace.form.Panel",

    autoLoadData    : false,
    hideOkButton    : true,
    hideResetButton : true,
    mode            : "local",

    getFormItems : function() {
        var me = this;

        return [{
            /* VDR info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3>VDR</h3>'
                        + '<p>'
                        + 'VDR stands for "Video Disk Recorder". VDR needs a TV Tuner device to work. VDR works in DVB and ATSC networks.'
                        + '</p>'
                        + '<h3>First time use</h3>'
                        + '<p>'
                        + '1: Check that your TV Tuner device is detected. Use "Check for Connected Devices" button' + '<br>'
                        + '2: Set Transponder Type' + '<br>'
                        + '3: Adjust Transponder Settings' + '<br>'
                        + '4: Scan Channels' + '<br>'
                        + '5: After Channel Scan is completed set Recording directory etc.' + '<br>'
                        + '6: Enable VDR and the features you want.' + '<br>'
                        + '</p>'
            }]
        },{
            /* VDRAdmin-AM info*/
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3>VDRAdmin-AM</h3>'
                        + '<p>'
                        + 'VDRAdmin-AM is a web based user interface to VDR.'  + '<br>'
                        + 'The default username/password is linvdr/linvdr. These can be changed from VDRAdmin-AM under Configuration/Identification.'
                        + '</p>'
            }]
        }]
    }

});

OMV.WorkspaceManager.registerPanel({
    id        : "info",
    path      : "/service/vdr",
    text      : _("Info"),
    position  : 30,
    className : "OMV.module.admin.service.vdr.Info"
});
