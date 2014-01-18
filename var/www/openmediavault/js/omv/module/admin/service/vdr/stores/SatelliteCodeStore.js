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
        }],
        proxy : {
            type    : "rpc",
            rpcData : {
                service : "VDR",
                method  : "enumerateSatellites"
            },
            appendSortParams : false
        }
    })
});
