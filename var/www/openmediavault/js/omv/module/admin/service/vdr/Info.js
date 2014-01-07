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
                        + '<ol>'
                        + '<li>'
                        + 'Check that your TV Tuner device is detected. Use "Check for Connected Devices" button'
                        + '</li>'
                        + '<li>'
                        + 'Set Transponder Type'
                        + '</li>'
                        + '<li>'
                        + 'Adjust Transponder Settings'
                        + '</li>'
                        + '<li>'
                        + 'Scan Channels'
                        + '</li>'
                        + '<li>'
                        + 'After Channel Scan is completed set Recording directory etc.'
                        + '</li>'
                        + '<li>'
                        + 'Enable VDR and the features you want.'
                        + '</li>'
                        + '</ol>'
                        + '</p>'
            }]
        },{
            /* streamdev info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3>VDR-plugin-streamdev-server</h3>'
                        + '<p>'
                        + 'VDR-plugin-streamdev-server enables streaming from VDR to other computers in the network.'
                        + '</p>'
                        + '<p>'
                        + 'If you change the streamdev-server port VDR-plugin-live and VDRAdmin-AM parameters are automatically updated to match the port of the streamdev-server.'
                        + '</p>'
                        + '<h3>Port</h3>'
                        + '<p>'
                        + 'The port setting refers to HTTP port.'
                        + '</p>'
                        + '<h3>Allowed hosts</h3>'
                        + '<p>'
                        + 'Allowed hosts parameter defines what IP-addresses can connect to the streamdev-server.'
                        + '</p>'
                        + '<p>'
                        + 'This parameter uses CIDR notation. Value "192.168.1.0/24" = Connections are allowed from IP-address range 192.168.1.0-192.168.1.255.' 
                        + 'The parameter can also be just a single IP-address.'
                        + '</p>'
            }]
        },{
            /* live info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3>VDR-plugin-live</h3>'
                        + '<p>'
                        + 'VDR-plugin-live  is a web based user interface to VDR.'
                        + '</p>'
                        + '<p>'
                        + 'The default username/password is admin/live. These can be changed from VDR-plugin-live under Setup/Use authentication.'
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
                        + 'VDRAdmin-AM is a web based user interface to VDR.'
                        + '</p>'
                        + '<p>'
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
