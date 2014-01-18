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
        }],
        proxy : {
            type    : "rpc",
            rpcData : {
                service : "VDR",
                method  : "enumerateCountries"
            },
            appendSortParams : false
        }
    })
});
