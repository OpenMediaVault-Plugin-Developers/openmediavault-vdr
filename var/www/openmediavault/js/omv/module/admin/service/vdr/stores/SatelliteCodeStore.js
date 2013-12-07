Ext.define("OMV.module.admin.service.vdr.stores.SatelliteCodeStore", {
    extend   : "OMV.data.Store",
    autoLoad : true,

    model : OMV.data.Model.createImplicit({
        idProperty : "name",
        fields     : [{
            name : "abbr",
            type : "string"
        },{
            name : "satellite",
            type : "string"
        }]
    }),

    data : [{
        abbr      : 'S4E8',
        satellite : '4.8 east Sirius'
    },{
        abbr      : 'S7E0',
        satellite : '7.0 east Eutelsat W3A'
    },{
        abbr      : 'S9E0',
        satellite : '9.0 east Eurobird 9'
    },{
        abbr      : 'S10E0',
        satellite : '10.0 east Eutelsat W1'
    },{
        abbr      : 'S13E0',
        satellite : '13.0 east Hotbird 6/7A/8'
    },{
        abbr      : 'S16E0',
        satellite : '16.0 east Eutelsat W2'
    },{
        abbr      : 'S19E2',
        satellite : '19.2 east Astra 1F/1G/1H/1KR/1L'
    },{
        abbr      : 'S21E6',
        satellite : '21.6 east Eutelsat W6'
    },{
        abbr      : 'S23E5',
        satellite : '23.5 east Astra 1E/3A'
    },{
        abbr      : 'S25E5',
        satellite : '25.5 east Eurobird 2'
    },{
        abbr      : 'S26EX',
        satellite : '26.X east Badr C/3/4/6'
    },{
        abbr      : 'S28E2',
        satellite : '28.2 east Astra 2A/2B/2C/2D'
    },{
        abbr      : 'S28E5',
        satellite : '28.5 east EuroBird 1'
    },{
        abbr      : 'S31E5',
        satellite : '31.5 east Astra 5A/1D'
    },{
        abbr      : 'S32E9',
        satellite : '32.9 east Intelsat 802'
    },{
        abbr      : 'S33E0',
        satellite : '33.0 east Eurobird 3'
    },{
        abbr      : 'S35E9',
        satellite : '35.9 east Eutelsat W4'
    },{
        abbr      : 'S36E0',
        satellite : '36.0 east Eutelsat Sesat'
    },{
        abbr      : 'S38E0',
        satellite : '38.0 east Paksat 1'
    },{
        abbr      : 'S39E0',
        satellite : '39.0 east Hellas Sat 2'
    },{
        abbr      : 'S40EX',
        satellite : '40.X east Express AM1'
    },{
        abbr      : 'S41E9',
        satellite : '41.9 east Turksat 2A/3A'
    },{
        abbr      : 'S45E0',
        satellite : '45.0 east Intelsat 12'
    },{
        abbr      : 'S49E0',
        satellite : '49.0 east Yamal 202'
    },{
        abbr      : 'S53E0',
        satellite : '53.0 east Express AM22'
    },{
        abbr      : 'S57E0',
        satellite : '57.0 east Bonum 1'
    },{
        abbr      : 'S57EX',
        satellite : '57.X east NSS 703'
    },{
        abbr      : 'S60EX',
        satellite : '60.X east Intelsat 904'
    },{
        abbr      : 'S62EX',
        satellite : '62.X east Intelsat 902'
    },{
        abbr      : 'S64E2',
        satellite : '64.2 east Intelsat 906'
    },{
        abbr      : 'S68EX',
        satellite : '68.X east Intelsat 7/10'
    },{
        abbr      : 'S70E5',
        satellite : '70.5 east Eutelsat W5'
    },{
        abbr      : 'S72EX',
        satellite : '72.X east Intelsat 4'
    },{
        abbr      : 'S75EX',
        satellite : '75.X east ABS 1'
    },{
        abbr      : 'S76EX',
        satellite : '76.X east Telstar 10'
    },{
        abbr      : 'S78E5',
        satellite : '78.5 east Thaicom 2/5'
    },{
        abbr      : 'S80EX',
        satellite : '80.X east Express AM2'
    },{
        abbr      : 'S83EX',
        satellite : '83.X east Insat 2E/3B/4A'
    },{
        abbr      : 'S87E5',
        satellite : '87.5 east ChinaStar 1'
    },{
        abbr      : 'S88EX',
        satellite : '88.X east ST 1'
    },{
        abbr      : 'S90EX',
        satellite : '90.X east Yamal 201'
    },{
        abbr      : 'S91E5',
        satellite : '91.5 east Measat 3'
    },{
        abbr      : 'S93E5',
        satellite : '93.5 east Insat 3A/4B'
    },{
        abbr      : 'S95E0',
        satellite : '95.0 east NSS 6'
    },{
        abbr      : 'S96EX',
        satellite : '96.X east Express AM33'
    },{
        abbr      : 'S100EX',
        satellite : '100.X east AsiaSat 2'
    },{
        abbr      : 'S105EX',
        satellite : '105.X east AsiaSat 3S'
    },{
        abbr      : 'S108EX',
        satellite : '108.X east Telkom 1 & NSS 11'
    },{
        abbr      : 'S140EX',
        satellite : '140.X east Express AM3'
    },{
        abbr      : 'S160E0',
        satellite : '160.0 east Optus D1'
    },{
        abbr      : 'S0W8',
        satellite : '0.8 west Thor 3/5 & Intelsat 10-02'
    },{
        abbr      : 'S4W0',
        satellite : '4.0 west Amos 1/2/3'
    },{
        abbr      : 'S5WX',
        satellite : '5.X west Atlantic Bird 3'
    },{
        abbr      : 'S7W0',
        satellite : '7.0 west Nilesat 101/102 & Atlantic Bird 4'
    },{
        abbr      : 'S8W0',
        satellite : '8.0 west Atlantic Bird 2'
    },{
        abbr      : 'S11WX',
        satellite : '11.X west Express A3'
    },{
        abbr      : 'S12W5',
        satellite : '12.5 west Atlantic Bird 1'
    },{
        abbr      : 'S14W0',
        satellite : '14.0 west Express A4'
    },{
        abbr      : 'S15W0',
        satellite : '15.0 west Telstar 12'
    },{
        abbr      : 'S18WX',
        satellite : '18.X west Intelsat 901'
    },{
        abbr      : 'S22WX',
        satellite : '22.X west NSS 7'
    },{
        abbr      : 'S24WX',
        satellite : '24.X west Intelsat 905'
    },{
        abbr      : 'S27WX',
        satellite : '27.X west Intelsat 907'
    },{
        abbr      : 'S30W0',
        satellite : '30.0 west Hispasat 1C/1D'
    },{
        abbr      : 'S97W0',
        satellite : '97.0 west Telstar 5'
    }]
});
