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
 * @class OMV.module.admin.service.vdrplugin.vdrSettings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.vdrplugin.vdrSettings", { // Define a new class
	extend: "OMV.workspace.form.Panel", // What is the base type of this class

	requires: [
	    "OMV.data.Store",
		"OMV.data.Model"
        ],

	rpcService: "VDR", // Remote Procedure Call 
	rpcGetMethod: "getSettings", // Remote Procedure Call 
	rpcSetMethod: "setSettings", // Remote Procedure Call 

    plugins: [
        {
        ptype: "linkedfields",
        correlations: [{   
            conditions: [{ name: "vdr_enable", value: true}],
            name: ["vdr_scanbutton"],
            properties: "disabled"
        }]
        },
        {
        ptype: "linkedfields",
        correlations: [{   
            conditions: [{ name: "vdr_transpondertype", value: "a"}],
            name: ["atsc_fieldset"],
            properties: "show"
        }]
        },
        {
        ptype: "linkedfields",
        correlations: [{   
            conditions: [{ name: "vdr_transpondertype", value: "t"}],
            name: ["terrestial_fieldset"],
            properties: "show"
        }]
        },
        {
        ptype: "linkedfields",
        correlations: [{   
            conditions: [{ name: "vdr_transpondertype", value: "c"}],
            name: ["cable_fieldset"],
            properties: "show"
        }]
        },
        {
        ptype: "linkedfields",
        correlations: [{   
            conditions: [{ name: "vdr_transpondertype", value: "s"}],
            name: ["satellite_fieldset"],
            properties: "show"
        }]
        }
    ],

//*****************************************
//*****************************************
//*****************************************

	getFormItems: function() { // Generic function for this class that initializes the GUI
        var me = this;
		return [{
			xtype: "fieldset", // Type of the item
			title: _("VDR settings"), // Text that is shown on the top edge of the fieldset
			fieldDefaults: {labelSeparator: ""},
			items: [{ // These items are inside the fieldset item defined above
				xtype: "checkbox", // Type of the item 
				name: "vdr_enable", // Individual name of the item
				fieldLabel: _("Enable"), // Text that is shown next to the checkbox. Keep this under 15 characters
				checked: false // Default value if no settings have been applied yet, Try to change this to true
				},
				{
				xtype: "combo", // Type of the item
				name: "vdr_transpondertype", // Individual name of the item
				fieldLabel: "Transponder Type", // Text that is shown next to the number field. Keep this under 15 characters
                allowBlank: false,
                editable: false,
				store: [['a','ATSC'],['t','DVB-T (Terrestial)'],['c','DVB-C (Cable)'],['s','DVB-S (Satellite)']],
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus:true
				},
                {
                xtype: "fieldset", // Type of the item
                id: "atsc_fieldset",
                title: _("ATSC Transponder settings"), // Text that is shown on the top edge of the fieldset
                fieldDefaults: {labelSeparator: ""},
                hidden: true, // Visibility enabled by combobox
                items: [
                    {
				    xtype: "checkbox", 
				    name: "vdr_atsc_scan_encrypted", 
				    fieldLabel: _("Encrypted Channels"),
                    boxLabel: "Check to scan for encrypted channels. If Syslog starts to fill up disable this.", 
				    checked: false 
				    },                    
                    {
                    xtype: "combo",
                    name: "vdr_atsc_country",
                    fieldLabel: "Country",
                    allowBlank: true,
                    editable: true,
                    forceSelection: true,
				    store: "countrycode",
				    displayField: "country",
				    valueField: "abbr",
                    queryMode: 'local',
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    },
                    {
                    xtype: "combo", // Type of the item
                    name: "vdr_atsc_type", // Individual name of the item
                    fieldLabel: "Transponder Type", // Text that is shown next to the number field. Keep this under 15 characters
                    allowBlank: false,
                    editable: false,
                    store: [['1','Terrestial'],['2','Cable'],['3','Terrestial and Cable']],
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    }
                    ]
                },
                {
                xtype: "fieldset", // Type of the item
                id: "terrestial_fieldset",
                title: _("DVB-T Transponder settings"), // Text that is shown on the top edge of the fieldset
                fieldDefaults: {labelSeparator: ""},
                hidden: true, // Visibility enabled by combobox
                items: [
                    {
				    xtype: "checkbox", 
				    name: "vdr_dvb_t_scan_encrypted", 
				    fieldLabel: _("Encrypted Channels"),
                    boxLabel: "Check to scan for encrypted channels. If Syslog starts to fill up disable this.", 
				    checked: false 
				    },  
                    {
                    xtype: "combo",
                    name: "vdr_dvb_t_country",
                    fieldLabel: "Country",
                    allowBlank: true,
                    editable: true,
                    forceSelection: true,
				    store: "countrycode",
				    displayField: "country",
				    valueField: "abbr",
                    queryMode: 'local',
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    }
                    ]
                },
                {
                xtype: "fieldset", // Type of the item
                id: "cable_fieldset",
                title: _("DVB-C Transponder settings"), // Text that is shown on the top edge of the fieldset
                fieldDefaults: {labelSeparator: ""},
                hidden: true, // Visibility enabled by combobox
                items: [
                    {
				    xtype: "checkbox", 
				    name: "vdr_dvb_c_scan_encrypted", 
				    fieldLabel: _("Encrypted Channels"),
                    boxLabel: "Check to scan for encrypted channels. If Syslog starts to fill up disable this.", 
				    checked: false 
				    }, 
                    {
                    xtype: "combo",
                    name: "vdr_dvb_c_country",
                    fieldLabel: "Country",
                    allowBlank: true,
                    editable: true,
                    forceSelection: true,
				    store: "countrycode",
				    displayField: "country",
				    valueField: "abbr",
                    queryMode: 'local',
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    },
                    {
                    xtype: "combo",
                    name: "vdr_dvb_c_qam",
                    fieldLabel: "Modulation",
                    allowBlank: true,
                    editable: false,
				    store: [[' ','Not Used'],['0','QAM64'],['1','QAM256'],['2','QAM128']],
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    },
                    {
                    xtype: "combo",
                    name: "vdr_dvb_c_symbolrate",
                    fieldLabel: "Symbol rate",
                    allowBlank: true,
                    editable: false,
				    store: [[' ','Not Used'],['0','6900'],['1','6875'],['2','6111'],['3','6250'],['4','6790'],['5','6811'],['6','5900'],['7','5000'],['8','3450'],['9','4000'],['10','6950'],['11','7000'],['12','6952'],['13','5156'],['14','4583']],
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    },
                    {
				    xtype: "checkbox", 
				    name: "vdr_dvb_c_extended_qam", 
				    fieldLabel: _("Extended QAM scan"),
                    boxLabel: "(Enable QAM128) recommended for Nethterlands and Finland", 
				    checked: false 
				    }
                    ]
                },
                {
                xtype: "fieldset", // Type of the item
                name: "satellite_fieldset",
                title: _("DVB-S Transponder settings"), // Text that is shown on the top edge of the fieldset
                fieldDefaults: {labelSeparator: ""},
                hidden: true, // Visibility enabled by combobox
                items: [
                    {
				    xtype: "checkbox", 
				    name: "vdr_dvb_s_scan_encrypted", 
				    fieldLabel: _("Encrypted Channels"),
                    boxLabel: "Check to scan for encrypted channels. If Syslog starts to fill up disable this.", 
				    checked: false 
				    }, 
                    {
                    xtype: "combo",
                    name: "vdr_dvb_s_country",
                    fieldLabel: "Country",
                    allowBlank: true,
                    editable: true,
                    forceSelection: true,
				    store: "countrycode",
				    displayField: "country",
				    valueField: "abbr",
                    queryMode: 'local',
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    },
                    {
                    xtype: "combo",
                    name: "vdr_dvb_s_satellite",
                    fieldLabel: "Satellite",
                    allowBlank: true,
                    editable: true,
                    forceSelection: true,
				    store: "satellitecode",
				    displayField: "satellite",
				    valueField: "abbr",
                    queryMode: 'local',
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true
                    }
                    ]
                },
                {
                xtype : "button",
                name : "vdr_scanbutton",
                text : _("Scan Channels"),
                handler : Ext.Function.bind(me.onScanButton, me, [ me ]),
                scope : me
                },
                {
                xtype: "text",
                id: "vdr_initialscan_notdone",
                text: "NOTE! Disabled VDR to enable scanning.",
                style:{
                    textDecoration: "underline",
                    fontWeight: "bold",
                    fontSize: "110%",
                    paddingBottom: "5px",
                    paddingLeft: "10px",
                    paddingRight: "10px"
                    }
                },
                {
                xtype : "button",
                name : "vdr_scanstatusbutton",
                text : _("Scan Status"),
                handler : Ext.Function.bind(me.onScanStatusButton, me, [ me ]),
                scope : me
                },
                {
                xtype: "sharedfoldercombo",
                name: "vdr_recordingdir",
                fieldLabel: "Recording directory",
                allowBlank:true
                },
				{
				xtype: "numberfield", 
				name: "vdr_maxfilesize_gb", 
				fieldLabel: "Maximum filesize in GB", 
				minValue: 1,
				allowDecimals: false, 
				allowBlank: false
				},
                {
                xtype: "checkbox", 
				name: "vdr_subtitles", 
				fieldLabel: _("Use Subtitles"), 
				checked: false
                },
                {
                xtype: "textfield",
                name: "vdr_subtitle_languages",
                fieldLabel: "Subtitle language(s)"
                },
                {
                xtype: "textfield",
                name: "vdr_epglanguage",
                fieldLabel: "EPG language"
                },
                {
				xtype: "combo", // Type of the item
				name: "vdr_channelupdatemode", // Individual name of the item
				fieldLabel: "Channel Update Mode", // Text that is shown next to the number field. Keep this under 15 characters
                allowBlank: false,
                editable: false,
				store: [['0','0 No update'],['1','1 Only Channel Names'],['2','2 Only Channel PIDs'],['3','3 Channel Names and PIDs'],['4','4 All updates and add newly found channels'],['5','5 All updates, new channels and add new transponders']],
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus:true
				}
                ]
			},
            {
			xtype: "fieldset", // Type of the item
			title: _("VDRAdmin-AM settings"), // Text that is shown on the top edge of the fieldset
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{ // These items are inside the fieldset item defined above
				xtype: "checkbox", // Type of the item 
				name: "vdradminam_enable", // Individual name of the item
				fieldLabel: _("Enable"), // Text that is shown next to the checkbox. Keep this under 15 characters
				checked: false // Default value if no settings have been applied yet, Try to change this to true
				},
				{
				xtype: "numberfield", // Type of the item
				name: "vdradminam_port", // Individual name of the item
				fieldLabel: "Port Number", // Text that is shown next to the number field. Keep this under 15 characters
				minValue: 0, // Self explanatory
				allowDecimals: false, // Self explanatory
				allowBlank: true // Self explanatory
				}]
            }]
		
	},
    
     onScanButton: function() {
        var me = this;

        OMV.Rpc.request({
            scope : me,
            rpcData : {
                service : "VDR",
                method : "scanChannels",
                params : {
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
        me.fireEvent("exception", me, msg);
        OMV.MessageBox.info(null, msg);
    },

    onScanStatusButton: function() {
        var me = this;
        OMV.Rpc.request({
            scope : me,
            callback: me.onScanStatus,
            rpcData : {
                service : "VDR",
                method : "scanStatus"
            }
        });
    },
	onScanStatus: function(id, success, response) {
		var me = this;
		if(!success) {
			me.fireEvent("exception", me, response);
			OMV.MessageBox.error(null, response);
		}
        else {
            var msg = "";
            if(response == "0") {
                msg = "Channel scan is still running.";
            }
            else if(response == "1") {
                msg = "Channel Scan is not active.";
            }
            me.fireEvent("exception", me, msg);
            OMV.MessageBox.info(null, msg);
        }
	},

//*****************************************
//*****************************************
//*****************************************

    initComponent: function() {
		var me = this;
        
        //****************************************
        // Country Codes
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
                storeId: "countrycode",
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					fields: [
						{ name: "abbr", type: "string" },
						{ name: "country", type: "string" }
					]
				}),
                data: [
                        {abbr:' ', country:'Not Used'},
                        {abbr:'AF', country:'AFGHANISTAN'},
                        {abbr:'AX', country:'ÅLAND ISLANDS'},
                        {abbr:'AL', country:'ALBANIA'},
                        {abbr:'DZ', country:'ALGERIA'},
                        {abbr:'AS', country:'AMERICAN SAMOA'},
                        {abbr:'AD', country:'ANDORRA'},
                        {abbr:'AO', country:'ANGOLA'},
                        {abbr:'AI', country:'ANGUILLA'},
                        {abbr:'AQ', country:'ANTARCTICA'},
                        {abbr:'AG', country:'ANTIGUA AND BARBUDA'},
                        {abbr:'AR', country:'ARGENTINA'},
                        {abbr:'AM', country:'ARMENIA'},
                        {abbr:'AW', country:'ARUBA'},
                        {abbr:'AU', country:'AUSTRALIA'},
                        {abbr:'AT', country:'AUSTRIA'},
                        {abbr:'AZ', country:'AZERBAIJAN'},
                        {abbr:'BS', country:'BAHAMAS'},
                        {abbr:'BH', country:'BAHRAIN'},
                        {abbr:'BD', country:'BANGLADESH'},
                        {abbr:'BB', country:'BARBADOS'},
                        {abbr:'BY', country:'BELARUS'},
                        {abbr:'BE', country:'BELGIUM'},
                        {abbr:'BZ', country:'BELIZE'},
                        {abbr:'BJ', country:'BENIN'},
                        {abbr:'BM', country:'BERMUDA'},
                        {abbr:'BT', country:'BHUTAN'},
                        {abbr:'BO', country:'BOLIVIA'},
                        {abbr:'BA', country:'BOSNIA AND HERZEGOVINA'},
                        {abbr:'BW', country:'BOTSWANA'},
                        {abbr:'BV', country:'BOUVET ISLAND'},
                        {abbr:'BR', country:'BRAZIL'},
                        {abbr:'IO', country:'BRITISH INDIAN OCEAN TERRITORY'},
                        {abbr:'BN', country:'BRUNEI DARUSSALAM'},
                        {abbr:'BG', country:'BULGARIA'},
                        {abbr:'BF', country:'BURKINA FASO'},
                        {abbr:'BI', country:'BURUNDI'},
                        {abbr:'KH', country:'CAMBODIA'},
                        {abbr:'CM', country:'CAMEROON'},
                        {abbr:'CA', country:'CANADA'},
                        {abbr:'CV', country:'CAPE VERDE'},
                        {abbr:'KY', country:'CAYMAN ISLANDS'},
                        {abbr:'CF', country:'CENTRAL AFRICAN REPUBLIC'},
                        {abbr:'TD', country:'CHAD'},
                        {abbr:'CL', country:'CHILE'},
                        {abbr:'CN', country:'CHINA'},
                        {abbr:'CX', country:'CHRISTMAS ISLAND'},
                        {abbr:'CC', country:'COCOS (KEELING) ISLANDS'},
                        {abbr:'CO', country:'COLOMBIA'},
                        {abbr:'KM', country:'COMOROS'},
                        {abbr:'CG', country:'CONGO'},
                        {abbr:'CD', country:'CONGO, THE DEMOCRATIC REPUBLIC OF THE'},
                        {abbr:'CK', country:'COOK ISLANDS'},
                        {abbr:'CR', country:'COSTA RICA'},
                        {abbr:'CI', country:'C�TE D IVOIRE'},
                        {abbr:'HR', country:'CROATIA'},
                        {abbr:'CU', country:'CUBA'},
                        {abbr:'CY', country:'CYPRUS'},
                        {abbr:'CZ', country:'CZECH REPUBLIC'},
                        {abbr:'DK', country:'DENMARK'},
                        {abbr:'DJ', country:'DJIBOUTI'},
                        {abbr:'DM', country:'DOMINICA'},
                        {abbr:'DO', country:'DOMINICAN REPUBLIC'},
                        {abbr:'EC', country:'ECUADOR'},
                        {abbr:'EG', country:'EGYPT'},
                        {abbr:'SV', country:'EL SALVADOR'},
                        {abbr:'GQ', country:'EQUATORIAL GUINEA'},
                        {abbr:'ER', country:'ERITREA'},
                        {abbr:'EE', country:'ESTONIA'},
                        {abbr:'ET', country:'ETHIOPIA'},
                        {abbr:'FK', country:'FALKLAND ISLANDS (MALVINAS)'},
                        {abbr:'FO', country:'FAROE ISLANDS'},
                        {abbr:'FJ', country:'FIJI'},
                        {abbr:'FI', country:'FINLAND'},
                        {abbr:'FR', country:'FRANCE'},
                        {abbr:'GF', country:'FRENCH GUIANA'},
                        {abbr:'PF', country:'FRENCH POLYNESIA'},
                        {abbr:'TF', country:'FRENCH SOUTHERN TERRITORIES'},
                        {abbr:'GA', country:'GABON'},
                        {abbr:'GM', country:'GAMBIA'},
                        {abbr:'GE', country:'GEORGIA'},
                        {abbr:'DE', country:'GERMANY'},
                        {abbr:'GH', country:'GHANA'},
                        {abbr:'GI', country:'GIBRALTAR'},
                        {abbr:'GR', country:'GREECE'},
                        {abbr:'GL', country:'GREENLAND'},
                        {abbr:'GD', country:'GRENADA'},
                        {abbr:'GP', country:'GUADELOUPE'},
                        {abbr:'GU', country:'GUAM'},
                        {abbr:'GT', country:'GUATEMALA'},
                        {abbr:'GG', country:'GUERNSEY'},
                        {abbr:'GN', country:'GUINEA'},
                        {abbr:'GW', country:'GUINEA-BISSAU'},
                        {abbr:'GY', country:'GUYANA'},
                        {abbr:'HT', country:'HAITI'},
                        {abbr:'HM', country:'HEARD ISLAND AND MCDONALD ISLANDS'},
                        {abbr:'VA', country:'HOLY SEE (VATICAN CITY STATE)'},
                        {abbr:'HN', country:'HONDURAS'},
                        {abbr:'HK', country:'HONG KONG'},
                        {abbr:'HU', country:'HUNGARY'},
                        {abbr:'IS', country:'ICELAND'},
                        {abbr:'IN', country:'INDIA'},
                        {abbr:'ID', country:'INDONESIA'},
                        {abbr:'IR', country:'IRAN, ISLAMIC REPUBLIC OF'},
                        {abbr:'IQ', country:'IRAQ'},
                        {abbr:'IE', country:'IRELAND'},
                        {abbr:'IM', country:'ISLE OF MAN'},
                        {abbr:'IL', country:'ISRAEL'},
                        {abbr:'IT', country:'ITALY'},
                        {abbr:'JM', country:'JAMAICA'},
                        {abbr:'JP', country:'JAPAN'},
                        {abbr:'JE', country:'JERSEY'},
                        {abbr:'JO', country:'JORDAN'},
                        {abbr:'KZ', country:'KAZAKHSTAN'},
                        {abbr:'KE', country:'KENYA'},
                        {abbr:'KI', country:'KIRIBATI'},
                        {abbr:'KP', country:'KOREA, DEMOCRATIC PEOPLE S REPUBLIC OF'},
                        {abbr:'KR', country:'KOREA, REPUBLIC OF'},
                        {abbr:'KW', country:'KUWAIT'},
                        {abbr:'KG', country:'KYRGYZSTAN'},
                        {abbr:'LA', country:'LAO PEOPLE S DEMOCRATIC REPUBLIC'},
                        {abbr:'LV', country:'LATVIA'},
                        {abbr:'LB', country:'LEBANON'},
                        {abbr:'LS', country:'LESOTHO'},
                        {abbr:'LR', country:'LIBERIA'},
                        {abbr:'LY', country:'LIBYAN ARAB JAMAHIRIYA'},
                        {abbr:'LI', country:'LIECHTENSTEIN'},
                        {abbr:'LT', country:'LITHUANIA'},
                        {abbr:'LU', country:'LUXEMBOURG'},
                        {abbr:'MO', country:'MACAO'},
                        {abbr:'MK', country:'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'},
                        {abbr:'MG', country:'MADAGASCAR'},
                        {abbr:'MW', country:'MALAWI'},
                        {abbr:'MY', country:'MALAYSIA'},
                        {abbr:'MV', country:'MALDIVES'},
                        {abbr:'ML', country:'MALI'},
                        {abbr:'MT', country:'MALTA'},
                        {abbr:'MH', country:'MARSHALL ISLANDS'},
                        {abbr:'MQ', country:'MARTINIQUE'},
                        {abbr:'MR', country:'MAURITANIA'},
                        {abbr:'MU', country:'MAURITIUS'},
                        {abbr:'YT', country:'MAYOTTE'},
                        {abbr:'MX', country:'MEXICO'},
                        {abbr:'FM', country:'MICRONESIA, FEDERATED STATES OF'},
                        {abbr:'MD', country:'MOLDOVA'},
                        {abbr:'MC', country:'MONACO'},
                        {abbr:'MN', country:'MONGOLIA'},
                        {abbr:'ME', country:'MONTENEGRO'},
                        {abbr:'MS', country:'MONTSERRAT'},
                        {abbr:'MA', country:'MOROCCO'},
                        {abbr:'MZ', country:'MOZAMBIQUE'},
                        {abbr:'MM', country:'MYANMAR'},
                        {abbr:'NA', country:'NAMIBIA'},
                        {abbr:'NR', country:'NAURU'},
                        {abbr:'NP', country:'NEPAL'},
                        {abbr:'NL', country:'NETHERLANDS'},
                        {abbr:'AN', country:'NETHERLANDS ANTILLES'},
                        {abbr:'NC', country:'NEW CALEDONIA'},
                        {abbr:'NZ', country:'NEW ZEALAND'},
                        {abbr:'NI', country:'NICARAGUA'},
                        {abbr:'NE', country:'NIGER'},
                        {abbr:'NG', country:'NIGERIA'},
                        {abbr:'NU', country:'NIUE'},
                        {abbr:'NF', country:'NORFOLK ISLAND'},
                        {abbr:'MP', country:'NORTHERN MARIANA ISLANDS'},
                        {abbr:'NO', country:'NORWAY'},
                        {abbr:'OM', country:'OMAN'},
                        {abbr:'PK', country:'PAKISTAN'},
                        {abbr:'PW', country:'PALAU'},
                        {abbr:'PS', country:'PALESTINIAN TERRITORY, OCCUPIED'},
                        {abbr:'PA', country:'PANAMA'},
                        {abbr:'PG', country:'PAPUA NEW GUINEA'},
                        {abbr:'PY', country:'PARAGUAY'},
                        {abbr:'PE', country:'PERU'},
                        {abbr:'PH', country:'PHILIPPINES'},
                        {abbr:'PN', country:'PITCAIRN'},
                        {abbr:'PL', country:'POLAND'},
                        {abbr:'PT', country:'PORTUGAL'},
                        {abbr:'PR', country:'PUERTO RICO'},
                        {abbr:'QA', country:'QATA'},
                        {abbr:'RE', country:'R�UNION'},
                        {abbr:'RO', country:'ROMANIA'},
                        {abbr:'RU', country:'RUSSIAN FEDERATION'},
                        {abbr:'RW', country:'RWANDA'},
                        {abbr:'BL', country:'SAINT BARTH�LEMY'},
                        {abbr:'SH', country:'SAINT HELENA'},
                        {abbr:'KN', country:'SAINT KITTS AND NEVIS'},
                        {abbr:'LC', country:'SAINT LUCIA'},
                        {abbr:'MF', country:'SAINT MARTIN'},
                        {abbr:'PM', country:'SAINT PIERRE AND MIQUELON'},
                        {abbr:'VC', country:'SAINT VINCENT AND THE GRENADINES'},
                        {abbr:'WS', country:'SAMOA'},
                        {abbr:'SM', country:'SAN MARINO'},
                        {abbr:'ST', country:'SAO TOME AND PRINCIPE'},
                        {abbr:'SA', country:'SAUDI ARABIA'},
                        {abbr:'SN', country:'SENEGAL'},
                        {abbr:'RS', country:'SERBIA'},
                        {abbr:'SC', country:'SEYCHELLES'},
                        {abbr:'SL', country:'SIERRA LEONE'},
                        {abbr:'SG', country:'SINGAPORE'},
                        {abbr:'SK', country:'SLOVAKIA'},
                        {abbr:'SI', country:'SLOVENIA'},
                        {abbr:'SB', country:'SOLOMON ISLANDS'},
                        {abbr:'SO', country:'SOMALIA'},
                        {abbr:'ZA', country:'SOUTH AFRICA'},
                        {abbr:'GS', country:'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'},
                        {abbr:'ES', country:'SPAIN'},
                        {abbr:'LK', country:'SRI LANKA'},
                        {abbr:'SD', country:'SUDAN'},
                        {abbr:'SR', country:'SURINAME'},
                        {abbr:'SJ', country:'SVALBARD AND JAN MAYEN'},
                        {abbr:'SZ', country:'SWAZILAND'},
                        {abbr:'SE', country:'SWEDEN'},
                        {abbr:'CH', country:'SWITZERLAND'},
                        {abbr:'SY', country:'SYRIAN ARAB REPUBLIC'},
                        {abbr:'TW', country:'TAIWAN'},
                        {abbr:'TJ', country:'TAJIKISTAN'},
                        {abbr:'TZ', country:'TANZANIA, UNITED REPUBLIC OF'},
                        {abbr:'TH', country:'THAILAND'},
                        {abbr:'TL', country:'TIMOR-LESTE'},
                        {abbr:'TG', country:'TOGO'},
                        {abbr:'TK', country:'TOKELAU'},
                        {abbr:'TO', country:'TONGA'},
                        {abbr:'TT', country:'TRINIDAD AND TOBAGO'},
                        {abbr:'TN', country:'TUNISIA'},
                        {abbr:'TR', country:'TURKEY'},
                        {abbr:'TM', country:'TURKMENISTAN'},
                        {abbr:'TC', country:'TURKS AND CAICOS ISLANDS'},
                        {abbr:'TV', country:'TUVALU'},
                        {abbr:'UG', country:'UGANDA'},
                        {abbr:'UA', country:'UKRAINE'},
                        {abbr:'AE', country:'UNITED ARAB EMIRATES'},
                        {abbr:'GB', country:'UNITED KINGDOM'},
                        {abbr:'US', country:'UNITED STATES'},
                        {abbr:'UM', country:'UNITED STATES MINOR OUTLYING ISLANDS'},
                        {abbr:'UY', country:'URUGUAY'},
                        {abbr:'UZ', country:'UZBEKISTAN'},
                        {abbr:'VU', country:'VANUATU'},
                        {abbr:'VE', country:'VENEZUELA'},
                        {abbr:'VN', country:'VIET NAM'},
                        {abbr:'VG', country:'VIRGIN ISLANDS, BRITISH'},
                        {abbr:'VI', country:'VIRGIN ISLANDS, U.S.'},
                        {abbr:'WF', country:'WALLIS AND FUTUNA'},
                        {abbr:'EH', country:'WESTERN SAHARA'},
                        {abbr:'YE', country:'YEMEN'},
                        {abbr:'ZM', country:'ZAMBIA'}
                ]
        
			})
		});
        //****************************************
        // Satellite Codes
        Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
                storeId: "satellitecode",
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					fields: [
						{ name: "abbr", type: "string" },
						{ name: "satellite", type: "string" }
					]
				}),
                data: [
                        {abbr:'S4E8', satellite:'4.8 east Sirius'},
                        {abbr:'S7E0', satellite:'7.0 east Eutelsat W3A'},
                        {abbr:'S9E0', satellite:'9.0 east Eurobird 9'},
                        {abbr:'S10E0', satellite:'10.0 east Eutelsat W1'},
                        {abbr:'S13E0', satellite:'13.0 east Hotbird 6/7A/8'},
                        {abbr:'S16E0', satellite:'16.0 east Eutelsat W2'},
                        {abbr:'S19E2', satellite:'19.2 east Astra 1F/1G/1H/1KR/1L'},
                        {abbr:'S21E6', satellite:'21.6 east Eutelsat W6'},
                        {abbr:'S23E5', satellite:'23.5 east Astra 1E/3A'},
                        {abbr:'S25E5', satellite:'25.5 east Eurobird 2'},
                        {abbr:'S26EX', satellite:'26.X east Badr C/3/4/6'},
                        {abbr:'S28E2', satellite:'28.2 east Astra 2A/2B/2C/2D'},
                        {abbr:'S28E5', satellite:'28.5 east EuroBird 1'},
                        {abbr:'S31E5', satellite:'31.5 east Astra 5A/1D'},
                        {abbr:'S32E9', satellite:'32.9 east Intelsat 802'},
                        {abbr:'S33E0', satellite:'33.0 east Eurobird 3'},
                        {abbr:'S35E9', satellite:'35.9 east Eutelsat W4'},
                        {abbr:'S36E0', satellite:'36.0 east Eutelsat Sesat'},
                        {abbr:'S38E0', satellite:'38.0 east Paksat 1'},
                        {abbr:'S39E0', satellite:'39.0 east Hellas Sat 2'},
                        {abbr:'S40EX', satellite:'40.X east Express AM1'},
                        {abbr:'S41E9', satellite:'41.9 east Turksat 2A/3A'},
                        {abbr:'S45E0', satellite:'45.0 east Intelsat 12'},
                        {abbr:'S49E0', satellite:'49.0 east Yamal 202'},
                        {abbr:'S53E0', satellite:'53.0 east Express AM22'},
                        {abbr:'S57E0', satellite:'57.0 east Bonum 1'},
                        {abbr:'S57EX', satellite:'57.X east NSS 703'},
                        {abbr:'S60EX', satellite:'60.X east Intelsat 904'},
                        {abbr:'S62EX', satellite:'62.X east Intelsat 902'},
                        {abbr:'S64E2', satellite:'64.2 east Intelsat 906'},
                        {abbr:'S68EX', satellite:'68.X east Intelsat 7/10'},
                        {abbr:'S70E5', satellite:'70.5 east Eutelsat W5'},
                        {abbr:'S72EX', satellite:'72.X east Intelsat 4'},
                        {abbr:'S75EX', satellite:'75.X east ABS 1'},
                        {abbr:'S76EX', satellite:'76.X east Telstar 10'},
                        {abbr:'S78E5', satellite:'78.5 east Thaicom 2/5'},
                        {abbr:'S80EX', satellite:'80.X east Express AM2'},
                        {abbr:'S83EX', satellite:'83.X east Insat 2E/3B/4A'},
                        {abbr:'S87E5', satellite:'87.5 east ChinaStar 1'},
                        {abbr:'S88EX', satellite:'88.X east ST 1'},
                        {abbr:'S90EX', satellite:'90.X east Yamal 201'},
                        {abbr:'S91E5', satellite:'91.5 east Measat 3'},
                        {abbr:'S93E5', satellite:'93.5 east Insat 3A/4B'},
                        {abbr:'S95E0', satellite:'95.0 east NSS 6'},
                        {abbr:'S96EX', satellite:'96.X east Express AM33'},
                        {abbr:'S100EX', satellite:'100.X east AsiaSat 2'},
                        {abbr:'S105EX', satellite:'105.X east AsiaSat 3S'},
                        {abbr:'S108EX', satellite:'108.X east Telkom 1 & NSS 11'},
                        {abbr:'S140EX', satellite:'140.X east Express AM3'},
                        {abbr:'S160E0', satellite:'160.0 east Optus D1'},
                        {abbr:'S0W8', satellite:'0.8 west Thor 3/5 & Intelsat 10-02'},
                        {abbr:'S4W0', satellite:'4.0 west Amos 1/2/3'},
                        {abbr:'S5WX', satellite:'5.X west Atlantic Bird 3'},
                        {abbr:'S7W0', satellite:'7.0 west Nilesat 101/102 & Atlantic Bird 4'},
                        {abbr:'S8W0', satellite:'8.0 west Atlantic Bird 2'},
                        {abbr:'S11WX', satellite:'11.X west Express A3'},
                        {abbr:'S12W5', satellite:'12.5 west Atlantic Bird 1'},
                        {abbr:'S14W0', satellite:'14.0 west Express A4'},
                        {abbr:'S15W0', satellite:'15.0 west Telstar 12'},
                        {abbr:'S18WX', satellite:'18.X west Intelsat 901'},
                        {abbr:'S22WX', satellite:'22.X west NSS 7'},
                        {abbr:'S24WX', satellite:'24.X west Intelsat 905'},
                        {abbr:'S27WX', satellite:'27.X west Intelsat 907'},
                        {abbr:'S30W0', satellite:'30.0 west Hispasat 1C/1D'},
                        {abbr:'S97W0', satellite:'97.0 west Telstar 5'}
                ]
        
			})
		});
        
		me.callParent(arguments);
	}
            

});

// Register the class that is defined above
OMV.WorkspaceManager.registerPanel({
	id: "vdrSettings", //Individual id
	path: "/service/vdrplugin", // Parent folder in the navigation view
	text: _("VDR Settings"), // Text to show on the tab , Shown only if multiple form panels
	position: 10, // Horizontal position of this tab. Use when you have multiple tabs
	className: "OMV.module.admin.service.vdrplugin.vdrSettings" // Same class name as defined above
});
