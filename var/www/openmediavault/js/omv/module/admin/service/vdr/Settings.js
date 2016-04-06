/**
 * Copyright (C) 2013-2015 OpenMediaVault Plugin Developers
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

Ext.define('OMV.module.admin.service.vdr.Settings', {
    extend: 'OMV.workspace.form.Panel',

    requires: [
        'OMV.data.Store',
        'OMV.data.Model'
    ],

    rpcService: 'Vdr',
    rpcGetMethod: 'getSettings',
    rpcSetMethod: 'setSettings',

    getFormItems: function() {
        return [{
            xtype: 'fieldset',
            title: _('General settings'),
            fieldDefaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'checkbox',
                name: 'enable',
                fieldLabel: _('Enable'),
                checked: false
            }, {
                xtype: 'combo',
                name: 'log_level',
                fieldLabel: _('Log level'),
                store: [
                    [0, _('No logging')],
                    [1, _('Errors only')],
                    [2, _('Errors and info')],
                    [3, _('Errors, info and debug')]
                ],
                allowBlank: false,
                editable: false,
                triggerAction: 'all',
                value: 1
            }, {
                xtype: 'numberfield',
                name: 'max_video_file_size',
                fieldLabel: _('Maximum filesize (MB)'),
                allowBlank: false,
                allowDecimals: false,
                minValue: 0,
                value: 2000
            }, {
                xtype: 'sharedfoldercombo',
                name: 'video.sharedfolderref',
                fieldLabel: _('Recording directory'),
                allowBlank: true,
                allowNone: true
            }, {
                xtype: 'textfield',
                name: 'audio_languages',
                fieldLabel: _('Audio languages')
            }, {
                xtype: 'textfield',
                name: 'epg_languages',
                fieldLabel: _('EPG languages')
            }, {
                xtype: 'checkbox',
                name: 'subtitle_enable',
                fieldLabel: _('Enable subtitles'),
                checked: false
            }, {
                xtype: 'textfield',
                name: 'subtitle_languages',
                fieldLabel: _('Subtitle languages')
            }, {
                xtype: 'combo',
                name: 'update_channels',
                fieldLabel: _('Update channels'),
                store: [
                    [0, _('No update')],
                    [1, _('Only channel names')],
                    [2, _('Channel names and PIDs')],
                    [3, _('All updates and add newly found channels')],
                    [4, _('All updates, newly found channels and add newly found transponders')]
                ],
                allowBlank: false,
                editable: false,
                triggerAction: 'all',
                value: 4
            }]
        }, {
            xtype: 'fieldset',
            title: _('Extra options'),
            items: [{
                xtype: 'textarea',
                name: 'extra_options',
                minHeight: 150,
                allowBlank: true
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'settings',
    path: '/service/vdr',
    text: _('Settings'),
    position: 10,
    className: 'OMV.module.admin.service.vdr.Settings'
});
