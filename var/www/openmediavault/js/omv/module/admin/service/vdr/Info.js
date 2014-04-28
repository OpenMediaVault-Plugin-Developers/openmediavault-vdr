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

/**
 * @class OMV.module.admin.service.vdr.Info
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
                html    : '<h3 style="margin-top: 5px;">VDR (Video Disk Recorder)</h3>' +
                          "<p>" +
                          "The VDR plugin needs a TV tuner device to operate. VDR works with DVB and ATSC networks." +
                          "</p>" +
                          "<h4>First time use</h4>" +
                          "<p>" +
                          "<ol>" +
                          "<li>" +
                          "Check that your TV tuner device is detected. Use the 'Check for connected devices' button." +
                          "</li>" +
                          "<li>" +
                          "Navigate to the manage channels tab and press on the scan button." +
                          "</li>" +
                          "<li>" +
                          "Set the transponder type." +
                          "</li>" +
                          "<li>" +
                          "Adjust transponder settings." +
                          "</li>" +
                          "<li>" +
                          "Save and scan." +
                          "</li>" +
                          "<li>" +
                          "After the channel scan is completed, set recording directory and other options." +
                          "</li>" +
                          "<li>" +
                          "Enable VDR and the features you want." +
                          "</li>" +
                          "</ol>" +
                          "</p>"
            }]
        },{
            /* Streamdev info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3 style="margin-top: 5px;">VDR-plugin-streamdev-server</h3>' +
                          "<p>" +
                          "Enables streaming from your VDR to other computers on your network." +
                          "</p>" +
                          "<h4>Port</h4>" +
                          "<p>" +
                          "Sets the TCP port on which the server listens for hosts.  If you change the streamdev-server port the VDR-plugin-live & VDRAdmin-AM parameters are automatically updated to match the port of the server.  " +
                          "Be sure to create a rule to open up the this port to your LAN if you are using OMVs Firewall." +  
                          "</p>" +
                          "<h4>Allowed hosts</h4>" +
                          "<p>" +
                          'This parameter defines the IP-addresses that are allowed to connect to the streamdev-server in CIDR notation (i.e. A local network can be specified via a value of <b>"192.168.1.0/24"</b>, which denotes a range of 192.168.1.0-192.168.1.255.  ' +
                          'Or a single IP-address may be used.)' +
                          "</p>"
            }]
        },{
            /* Live info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3 style="margin-top: 5px;">VDR-plugin-live</h3>' +
                          "<p>" +
                          "Is a web based user interface to VDR. The default <b>Username= admin</b> and <b>Password= live</b> are as such.  The UserID and Password can be changed in the user interface of VDR-plugin-live at Setup/Use authentication. Requires firewall rule if OMV's Firewall in use." +
                          "</p>"
            }]
        },{
            /* VDRAdmin-AM info */
            xtype : "fieldset",
            layout : "fit",
            items : [{
                border  : false,
                html    : '<h3 style="margin-top: 5px;">VDRAdmin-AM</h3>' +
                          "<p>" +
                          "Is also, an alternative, a web based user interface for VDR.  The default login is <b>Username= linvdr</b> and <b>Password= linvdr</b>. The UserID and Password can be changed in the user interface of VDRAdmin-AM under Configuration/Identification.  Requires firewall rule if OMV's Firewall in use." +
                          "</p>"
            }]
        }];
    }

});

OMV.WorkspaceManager.registerPanel({
    id        : "info",
    path      : "/service/vdr",
    text      : _("Info"),
    position  : 30,
    className : "OMV.module.admin.service.vdr.Info"
});
