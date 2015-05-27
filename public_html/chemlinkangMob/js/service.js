var ChemlinkService = function(server) {
    var url;
     
    this.getBatchData = function(batch) {
        url = server + "/Chemlink?quest=getAllData&batch=" + batch.toUpperCase();
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }
    
    this.getBatchStrid = function(batch) {
        url = server + "/Chemlink?quest=getStrid&batch=" + batch.toUpperCase();
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }
    this.getBatchCorpid = function(batch) {
        url = server + "/Chemlink?quest=getCorpid&batch=" + batch.toUpperCase();
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }

    this.getKss = function(corpid) {
        var url = server + '/Chemlink?quest=getKSS&corpid=' + corpid
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }

    this.getPro = function(corpid) {
        var url = server + '/Chemlink?quest=getProliferation&corpid=' + corpid
        return $.ajax(
        		{
        			type: "GET",
        			url: url 
        		});
    }
}