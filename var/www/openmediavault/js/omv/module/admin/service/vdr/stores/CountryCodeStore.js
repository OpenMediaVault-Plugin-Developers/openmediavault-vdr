Ext.define("OMV.module.admin.service.vdr.stores.CountryCodeStore", {
    extend   : "OMV.data.Store",
    autoLoad : true,

    model : OMV.data.Model.createImplicit({
        idProperty : "name",
        fields     : [{
            name : "abbr",
            type : "string"
        },{
            name : "country",
            type : "string"
        }]
    }),

    data : [{
        abbr    : ' ',
        country : 'Not Used'
    },{
        abbr    : 'AF',
        country : 'AFGHANISTAN'
    },{
        abbr    : 'AX',
        country : 'ÅLAND ISLANDS'
    },{
        abbr    : 'AL',
        country : 'ALBANIA'
    },{
        abbr    : 'DZ',
        country : 'ALGERIA'
    },{
        abbr    : 'AS',
        country : 'AMERICAN SAMOA'
    },{
        abbr    : 'AD',
        country : 'ANDORRA'
    },{
        abbr    : 'AO',
        country : 'ANGOLA'
    },{
        abbr    : 'AI',
        country : 'ANGUILLA'
    },{
        abbr    : 'AQ',
        country : 'ANTARCTICA'
    },{
        abbr    : 'AG',
        country : 'ANTIGUA AND BARBUDA'
    },{
        abbr    : 'AR',
        country : 'ARGENTINA'
    },{
        abbr    : 'AM',
        country : 'ARMENIA'
    },{
        abbr    : 'AW',
        country : 'ARUBA'
    },{
        abbr    : 'AU',
        country : 'AUSTRALIA'
    },{
        abbr    : 'AT',
        country : 'AUSTRIA'
    },{
        abbr    : 'AZ',
        country : 'AZERBAIJAN'
    },{
        abbr    : 'BS',
        country : 'BAHAMAS'
    },{
        abbr    : 'BH',
        country : 'BAHRAIN'
    },{
        abbr    : 'BD',
        country : 'BANGLADESH'
    },{
        abbr    : 'BB',
        country : 'BARBADOS'
    },{
        abbr    : 'BY',
        country : 'BELARUS'
    },{
        abbr    : 'BE',
        country : 'BELGIUM'
    },{
        abbr    : 'BZ',
        country : 'BELIZE'
    },{
        abbr    : 'BJ',
        country : 'BENIN'
    },{
        abbr    : 'BM',
        country : 'BERMUDA'
    },{
        abbr    : 'BT',
        country : 'BHUTAN'
    },{
        abbr    : 'BO',
        country : 'BOLIVIA'
    },{
        abbr    : 'BA',
        country : 'BOSNIA AND HERZEGOVINA'
    },{
        abbr    : 'BW',
        country : 'BOTSWANA'
    },{
        abbr    : 'BV',
        country : 'BOUVET ISLAND'
    },{
        abbr    : 'BR',
        country : 'BRAZIL'
    },{
        abbr    : 'IO',
        country : 'BRITISH INDIAN OCEAN TERRITORY'
    },{
        abbr    : 'BN',
        country : 'BRUNEI DARUSSALAM'
    },{
        abbr    : 'BG',
        country : 'BULGARIA'
    },{
        abbr    : 'BF',
        country : 'BURKINA FASO'
    },{
        abbr    : 'BI',
        country : 'BURUNDI'
    },{
        abbr    : 'KH',
        country : 'CAMBODIA'
    },{
        abbr    : 'CM',
        country : 'CAMEROON'
    },{
        abbr    : 'CA',
        country : 'CANADA'
    },{
        abbr    : 'CV',
        country : 'CAPE VERDE'
    },{
        abbr    : 'KY',
        country : 'CAYMAN ISLANDS'
    },{
        abbr    : 'CF',
        country : 'CENTRAL AFRICAN REPUBLIC'
    },{
        abbr    : 'TD',
        country : 'CHAD'
    },{
        abbr    : 'CL',
        country : 'CHILE'
    },{
        abbr    : 'CN',
        country : 'CHINA'
    },{
        abbr    : 'CX',
        country : 'CHRISTMAS ISLAND'
    },{
        abbr    : 'CC',
        country : 'COCOS (KEELING) ISLANDS'
    },{
        abbr    : 'CO',
        country : 'COLOMBIA'
    },{
        abbr    : 'KM',
        country : 'COMOROS'
    },{
        abbr    : 'CG',
        country : 'CONGO'
    },{
        abbr    : 'CD',
        country : 'CONGO, THE DEMOCRATIC REPUBLIC OF THE'
    },{
        abbr    : 'CK',
        country : 'COOK ISLANDS'
    },{
        abbr    : 'CR',
        country : 'COSTA RICA'
    },{
        abbr    : 'CI',
        country : 'C�TE D IVOIRE'
    },{
        abbr    : 'HR',
        country : 'CROATIA'
    },{
        abbr    : 'CU',
        country : 'CUBA'
    },{
        abbr    : 'CY',
        country : 'CYPRUS'
    },{
        abbr    : 'CZ',
        country : 'CZECH REPUBLIC'
    },{
        abbr    : 'DK',
        country : 'DENMARK'
    },{
        abbr    : 'DJ',
        country : 'DJIBOUTI'
    },{
        abbr    : 'DM',
        country : 'DOMINICA'
    },{
        abbr    : 'DO',
        country : 'DOMINICAN REPUBLIC'
    },{
        abbr    : 'EC',
        country : 'ECUADOR'
    },{
        abbr    : 'EG',
        country : 'EGYPT'
    },{
        abbr    : 'SV',
        country : 'EL SALVADOR'
    },{
        abbr    : 'GQ',
        country : 'EQUATORIAL GUINEA'
    },{
        abbr    : 'ER',
        country : 'ERITREA'
    },{
        abbr    : 'EE',
        country : 'ESTONIA'
    },{
        abbr    : 'ET',
        country : 'ETHIOPIA'
    },{
        abbr    : 'FK',
        country : 'FALKLAND ISLANDS (MALVINAS)'
    },{
        abbr    : 'FO',
        country : 'FAROE ISLANDS'
    },{
        abbr    : 'FJ',
        country : 'FIJI'
    },{
        abbr    : 'FI',
        country : 'FINLAND'
    },{
        abbr    : 'FR',
        country : 'FRANCE'
    },{
        abbr    : 'GF',
        country : 'FRENCH GUIANA'
    },{
        abbr    : 'PF',
        country : 'FRENCH POLYNESIA'
    },{
        abbr    : 'TF',
        country : 'FRENCH SOUTHERN TERRITORIES'
    },{
        abbr    : 'GA',
        country : 'GABON'
    },{
        abbr    : 'GM',
        country : 'GAMBIA'
    },{
        abbr    : 'GE',
        country : 'GEORGIA'
    },{
        abbr    : 'DE',
        country : 'GERMANY'
    },{
        abbr    : 'GH',
        country : 'GHANA'
    },{
        abbr    : 'GI',
        country : 'GIBRALTAR'
    },{
        abbr    : 'GR',
        country : 'GREECE'
    },{
        abbr    : 'GL',
        country : 'GREENLAND'
    },{
        abbr    : 'GD',
        country : 'GRENADA'
    },{
        abbr    : 'GP',
        country : 'GUADELOUPE'
    },{
        abbr    : 'GU',
        country : 'GUAM'
    },{
        abbr    : 'GT',
        country : 'GUATEMALA'
    },{
        abbr    : 'GG',
        country : 'GUERNSEY'
    },{
        abbr    : 'GN',
        country : 'GUINEA'
    },{
        abbr    : 'GW',
        country : 'GUINEA-BISSAU'
    },{
        abbr    : 'GY',
        country : 'GUYANA'
    },{
        abbr    : 'HT',
        country : 'HAITI'
    },{
        abbr    : 'HM',
        country : 'HEARD ISLAND AND MCDONALD ISLANDS'
    },{
        abbr    : 'VA',
        country : 'HOLY SEE (VATICAN CITY STATE)'
    },{
        abbr    : 'HN',
        country : 'HONDURAS'
    },{
        abbr    : 'HK',
        country : 'HONG KONG'
    },{
        abbr    : 'HU',
        country : 'HUNGARY'
    },{
        abbr    : 'IS',
        country : 'ICELAND'
    },{
        abbr    : 'IN',
        country : 'INDIA'
    },{
        abbr    : 'ID',
        country : 'INDONESIA'
    },{
        abbr    : 'IR',
        country : 'IRAN, ISLAMIC REPUBLIC OF'
    },{
        abbr    : 'IQ',
        country : 'IRAQ'
    },{
        abbr    : 'IE',
        country : 'IRELAND'
    },{
        abbr    : 'IM',
        country : 'ISLE OF MAN'
    },{
        abbr    : 'IL',
        country : 'ISRAEL'
    },{
        abbr    : 'IT',
        country : 'ITALY'
    },{
        abbr    : 'JM',
        country : 'JAMAICA'
    },{
        abbr    : 'JP',
        country : 'JAPAN'
    },{
        abbr    : 'JE',
        country : 'JERSEY'
    },{
        abbr    : 'JO',
        country : 'JORDAN'
    },{
        abbr    : 'KZ',
        country : 'KAZAKHSTAN'
    },{
        abbr    : 'KE',
        country : 'KENYA'
    },{
        abbr    : 'KI',
        country : 'KIRIBATI'
    },{
        abbr    : 'KP',
        country : 'KOREA, DEMOCRATIC PEOPLE S REPUBLIC OF'
    },{
        abbr    : 'KR',
        country : 'KOREA, REPUBLIC OF'
    },{
        abbr    : 'KW',
        country : 'KUWAIT'
    },{
        abbr    : 'KG',
        country : 'KYRGYZSTAN'
    },{
        abbr    : 'LA',
        country : 'LAO PEOPLE S DEMOCRATIC REPUBLIC'
    },{
        abbr    : 'LV',
        country : 'LATVIA'
    },{
        abbr    : 'LB',
        country : 'LEBANON'
    },{
        abbr    : 'LS',
        country : 'LESOTHO'
    },{
        abbr    : 'LR',
        country : 'LIBERIA'
    },{
        abbr    : 'LY',
        country : 'LIBYAN ARAB JAMAHIRIYA'
    },{
        abbr    : 'LI',
        country : 'LIECHTENSTEIN'
    },{
        abbr    : 'LT',
        country : 'LITHUANIA'
    },{
        abbr    : 'LU',
        country : 'LUXEMBOURG'
    },{
        abbr    : 'MO',
        country : 'MACAO'
    },{
        abbr    : 'MK',
        country : 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'
    },{
        abbr    : 'MG',
        country : 'MADAGASCAR'
    },{
        abbr    : 'MW',
        country : 'MALAWI'
    },{
        abbr    : 'MY',
        country : 'MALAYSIA'
    },{
        abbr    : 'MV',
        country : 'MALDIVES'
    },{
        abbr    : 'ML',
        country : 'MALI'
    },{
        abbr    : 'MT',
        country : 'MALTA'
    },{
        abbr    : 'MH',
        country : 'MARSHALL ISLANDS'
    },{
        abbr    : 'MQ',
        country : 'MARTINIQUE'
    },{
        abbr    : 'MR',
        country : 'MAURITANIA'
    },{
        abbr    : 'MU',
        country : 'MAURITIUS'
    },{
        abbr    : 'YT',
        country : 'MAYOTTE'
    },{
        abbr    : 'MX',
        country : 'MEXICO'
    },{
        abbr    : 'FM',
        country : 'MICRONESIA, FEDERATED STATES OF'
    },{
        abbr    : 'MD',
        country : 'MOLDOVA'
    },{
        abbr    : 'MC',
        country : 'MONACO'
    },{
        abbr    : 'MN',
        country : 'MONGOLIA'
    },{
        abbr    : 'ME',
        country : 'MONTENEGRO'
    },{
        abbr    : 'MS',
        country : 'MONTSERRAT'
    },{
        abbr    : 'MA',
        country : 'MOROCCO'
    },{
        abbr    : 'MZ',
        country : 'MOZAMBIQUE'
    },{
        abbr    : 'MM',
        country : 'MYANMAR'
    },{
        abbr    : 'NA',
        country : 'NAMIBIA'
    },{
        abbr    : 'NR',
        country : 'NAURU'
    },{
        abbr    : 'NP',
        country : 'NEPAL'
    },{
        abbr    : 'NL',
        country : 'NETHERLANDS'
    },{
        abbr    : 'AN',
        country : 'NETHERLANDS ANTILLES'
    },{
        abbr    : 'NC',
        country : 'NEW CALEDONIA'
    },{
        abbr    : 'NZ',
        country : 'NEW ZEALAND'
    },{
        abbr    : 'NI',
        country : 'NICARAGUA'
    },{
        abbr    : 'NE',
        country : 'NIGER'
    },{
        abbr    : 'NG',
        country : 'NIGERIA'
    },{
        abbr    : 'NU',
        country : 'NIUE'
    },{
        abbr    : 'NF',
        country : 'NORFOLK ISLAND'
    },{
        abbr    : 'MP',
        country : 'NORTHERN MARIANA ISLANDS'
    },{
        abbr    : 'NO',
        country : 'NORWAY'
    },{
        abbr    : 'OM',
        country : 'OMAN'
    },{
        abbr    : 'PK',
        country : 'PAKISTAN'
    },{
        abbr    : 'PW',
        country : 'PALAU'
    },{
        abbr    : 'PS',
        country : 'PALESTINIAN TERRITORY, OCCUPIED'
    },{
        abbr    : 'PA',
        country : 'PANAMA'
    },{
        abbr    : 'PG',
        country : 'PAPUA NEW GUINEA'
    },{
        abbr    : 'PY',
        country : 'PARAGUAY'
    },{
        abbr    : 'PE',
        country : 'PERU'
    },{
        abbr    : 'PH',
        country : 'PHILIPPINES'
    },{
        abbr    : 'PN',
        country : 'PITCAIRN'
    },{
        abbr    : 'PL',
        country : 'POLAND'
    },{
        abbr    : 'PT',
        country : 'PORTUGAL'
    },{
        abbr    : 'PR',
        country : 'PUERTO RICO'
    },{
        abbr    : 'QA',
        country : 'QATA'
    },{
        abbr    : 'RE',
        country : 'R�UNION'
    },{
        abbr    : 'RO',
        country : 'ROMANIA'
    },{
        abbr    : 'RU',
        country : 'RUSSIAN FEDERATION'
    },{
        abbr    : 'RW',
        country : 'RWANDA'
    },{
        abbr    : 'BL',
        country : 'SAINT BARTH�LEMY'
    },{
        abbr    : 'SH',
        country : 'SAINT HELENA'
    },{
        abbr    : 'KN',
        country : 'SAINT KITTS AND NEVIS'
    },{
        abbr    : 'LC',
        country : 'SAINT LUCIA'
    },{
        abbr    : 'MF',
        country : 'SAINT MARTIN'
    },{
        abbr    : 'PM',
        country : 'SAINT PIERRE AND MIQUELON'
    },{
        abbr    : 'VC',
        country : 'SAINT VINCENT AND THE GRENADINES'
    },{
        abbr    : 'WS',
        country : 'SAMOA'
    },{
        abbr    : 'SM',
        country : 'SAN MARINO'
    },{
        abbr    : 'ST',
        country : 'SAO TOME AND PRINCIPE'
    },{
        abbr    : 'SA',
        country : 'SAUDI ARABIA'
    },{
        abbr    : 'SN',
        country : 'SENEGAL'
    },{
        abbr    : 'RS',
        country : 'SERBIA'
    },{
        abbr    : 'SC',
        country : 'SEYCHELLES'
    },{
        abbr    : 'SL',
        country : 'SIERRA LEONE'
    },{
        abbr    : 'SG',
        country : 'SINGAPORE'
    },{
        abbr    : 'SK',
        country : 'SLOVAKIA'
    },{
        abbr    : 'SI',
        country : 'SLOVENIA'
    },{
        abbr    : 'SB',
        country : 'SOLOMON ISLANDS'
    },{
        abbr    : 'SO',
        country : 'SOMALIA'
    },{
        abbr    : 'ZA',
        country : 'SOUTH AFRICA'
    },{
        abbr    : 'GS',
        country : 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'
    },{
        abbr    : 'ES',
        country : 'SPAIN'
    },{
        abbr    : 'LK',
        country : 'SRI LANKA'
    },{
        abbr    : 'SD',
        country : 'SUDAN'
    },{
        abbr    : 'SR',
        country : 'SURINAME'
    },{
        abbr    : 'SJ',
        country : 'SVALBARD AND JAN MAYEN'
    },{
        abbr    : 'SZ',
        country : 'SWAZILAND'
    },{
        abbr    : 'SE',
        country : 'SWEDEN'
    },{
        abbr    : 'CH',
        country : 'SWITZERLAND'
    },{
        abbr    : 'SY',
        country : 'SYRIAN ARAB REPUBLIC'
    },{
        abbr    : 'TW',
        country : 'TAIWAN'
    },{
        abbr    : 'TJ',
        country : 'TAJIKISTAN'
    },{
        abbr    : 'TZ',
        country : 'TANZANIA, UNITED REPUBLIC OF'
    },{
        abbr    : 'TH',
        country : 'THAILAND'
    },{
        abbr    : 'TL',
        country : 'TIMOR-LESTE'
    },{
        abbr    : 'TG',
        country : 'TOGO'
    },{
        abbr    : 'TK',
        country : 'TOKELAU'
    },{
        abbr    : 'TO',
        country : 'TONGA'
    },{
        abbr    : 'TT',
        country : 'TRINIDAD AND TOBAGO'
    },{
        abbr    : 'TN',
        country : 'TUNISIA'
    },{
        abbr    : 'TR',
        country : 'TURKEY'
    },{
        abbr    : 'TM',
        country : 'TURKMENISTAN'
    },{
        abbr    : 'TC',
        country : 'TURKS AND CAICOS ISLANDS'
    },{
        abbr    : 'TV',
        country : 'TUVALU'
    },{
        abbr    : 'UG',
        country : 'UGANDA'
    },{
        abbr    : 'UA',
        country : 'UKRAINE'
    },{
        abbr    : 'AE',
        country : 'UNITED ARAB EMIRATES'
    },{
        abbr    : 'GB',
        country : 'UNITED KINGDOM'
    },{
        abbr    : 'US',
        country : 'UNITED STATES'
    },{
        abbr    : 'UM',
        country : 'UNITED STATES MINOR OUTLYING ISLANDS'
    },{
        abbr    : 'UY',
        country : 'URUGUAY'
    },{
        abbr    : 'UZ',
        country : 'UZBEKISTAN'
    },{
        abbr    : 'VU',
        country : 'VANUATU'
    },{
        abbr    : 'VE',
        country : 'VENEZUELA'
    },{
        abbr    : 'VN',
        country : 'VIET NAM'
    },{
        abbr    : 'VG',
        country : 'VIRGIN ISLANDS, BRITISH'
    },{
        abbr    : 'VI',
        country : 'VIRGIN ISLANDS, U.S.'
    },{
        abbr    : 'WF',
        country : 'WALLIS AND FUTUNA'
    },{
        abbr    : 'EH',
        country : 'WESTERN SAHARA'
    },{
        abbr    : 'YE',
        country : 'YEMEN'
    },{
        abbr    : 'ZM',
        country : 'ZAMBIA'
    }]
});
