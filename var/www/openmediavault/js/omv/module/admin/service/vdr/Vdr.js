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

OMV.WorkspaceManager.registerNode({
id: "vdrplugin", // Unique ID 
path: "/service", // Parent folder in the navigation view
text: _("VDR / VDRAdmin-AM"), // Text to show next to the icon
icon16: "images/play.png", // 16x16 pixel icon that is displayed in the navigation view 
iconSvg: "images/play.svg" // SVG icon that is displayed in the navigation view
});
