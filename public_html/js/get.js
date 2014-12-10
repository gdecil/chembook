//alert($.session.get("username"));

function createReaction( rxn,  product,  reagent) {
    var dataX = "{'rxn':'" + rxn + "','product':'" + product + "','reagent':'" + reagent + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/CreateReaction",
        data: dataX, 
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        return tmp;
    }
}

function checkBatchExistChemtools(batch) {
    var dataX = "{'batch':'" + batch + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/checkBatchExistChemtools",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function checkBatchExistChemeln(batch) {
    var dataX = "{'batch':'" + batch + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/checkBatchExistChemeln",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function checkUserPwd(username, password) {
    var dataX = "{'username':'" + username + "','password':'" + password + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/checkUserPwd",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getAttFileName(attacKey) {
    var dataX = "{'attacKey':'" + attacKey  + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetAttachement",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReq(parameters) {
    var dataX = "{'molecule':'ugo'}";
    var dataX = "";
    var ret = $.ajax({
        type: "POST",
        url: server + "/TestRequest.ashx",
        data: dataX,
//        contentType: "application/json; charset=utf-8",
//        processData: false,
//        dataType: "json",
        async: false
    }).responseText;
    alert(ret)
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReactionDetails(notebook, page) {
    var dataX = "{'notebook':'" + notebook + "','page':'" + page + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetExperiment",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getBatch(batch, format, type) {

    var dataX = "{'batch':'" + batch + "', 'format':'" + format + "', 'type':'" + type + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetBatch",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    //return $.parseJSON(ret);

    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        //return tmp;
    }
    else {

        return tmp.d;
//        return tmp.d.replace(/'/g, "\\\"");
    }
}

function getBottle(id, type) {
    var dataX = "{'id':'" + id + "', 'format':'json', 'type':'" + type + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetBottle",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
        //        return tmp.d.replace(/'/g, "\\\"");
    }
}

function getBottleForm(id,type) {
    var dataX = "{'strId':'" + id + "', 'type':'" + type + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetBottleForm",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
        //        return tmp.d.replace(/'/g, "\\\"");
    }
}
function getDecomp() {
    //var dataX = "{'batch':'" + batch + "', 'format':'json'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/Decomposition",
        //data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
        //        return tmp.d.replace(/'/g, "\\\"");
    }
}

function getEnumeration(rxn) {
    var dataX = "{'rxn':'" + rxn + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/Enumeration",
        //data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getFormulationData(strId) {
    var dataX = "{'strId':" + strId + "}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetFormulationData",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getImageFromSdf(sdf) {
    var dataX = "{'sdf':'" + sdf + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetImageFromSdf",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getNextPage(notebook) {
    var username = $.session.get("username");
    if (username == null || username == undefined || username == "") {
        alert("You are not logged in: You cannot insert or update data!")
        return false;
    };

    var dataX = "{'notebook':'" + notebook + "','username':'" + username + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetNextPage",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getProjects() {
    var dataX = "";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/getProjects",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

function getProducts(notebook, page,enumVal) {
    var dataX = "{'notebook':'" + notebook + "','page':'" + page + "','enumVal':'" + enumVal + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetProducts",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReagents(notebook, page, enumVal) {
    var dataX = "{'notebook':'" + notebook + "','page':'" + page + "','enumVal':'" + enumVal + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReagents",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getProductsIndigo(rxn) {
    var dataX = "{'rxn':'" + rxn + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetProductsIndigo",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReagentsIndigo(rxn) {
    var dataX = '{"rxn":"' + rxn + '"}';
//    dataX = JSON.stringify(dataX)
//    dataX = dataX.replace(/\n/g, "\\n")
//    dataX = '{\"rxn\":\"Ugo\nPippo\"}'
    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReagentsIndigo",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function FromReactionToMolecules(rxn) {
    var dataX = "{'rxn':'" + rxn + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/FromReactionToMolecules",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}


function getRXNidFromExperiment(notebook, page) {
    var dataX = "{'notebook':'" + notebook + "','page':'" + page + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetRXNidFromExperiment",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReaction(rxnId) {
    var dataX = "{'reactionId':'" + rxnId + "','cns':'' , 'outType':''}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReaction",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReactionImage(rxn) {
    var dataX = "{'rxn':'" + rxn + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReactionImage",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}
/**
 * Comment
 */
function getReactionTest(reaction, searchType) {
 var Reazione = {};
 Reazione.rxn = reaction;
 Reazione.searchType = searchType;
 Reazione.cns ="";

 var pdata = { "Reazione": Reazione };

 $.ajax({
     type: "POST",
     contentType: "application/json; charset=utf-8",
     url: server + "/Reaction.asmx/MatchBingoReaction",
     data: JSON.stringify(pdata),
     dataType: "json",
     async: true,
     success: function (data, textStatus) {

         if (textStatus == "success") {
             if (data.hasOwnProperty('d')) {
                 msg = data.d;
             } else {
                 msg = data;
             }
             alert(msg);

         }
     },
     error: function (data, status, error) {
         alert("error");
     }
 });
   
}

function getReactions(reaction, searchType) {
    var dataX = '{"compound":' + JSON.stringify(reaction) + ', "searchType":"' + searchType + '", "cns":""}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoReaction",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp;
    }
}

function getReactionsData(reaction) {
    var dataX = "{'compound':'" + reaction + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoReactionD",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReactionsMolecules(compound) {
    var dataX = "{'compound':'" + compound + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoChemtoolsSP",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getReactionsText(queryText) {

    var dataX = "{'query':'" + queryText + "', 'cns':''}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchReactionText",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function getTestJsonDb(id, cns) {

    var dataX = "{'reactionId':'" + id + "', 'cns':'" + cns + "', 'outType':''}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/TestGetJson",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        $("#result").append(ret);
        return tmp.d;
    }
}

function getTestJson(id, cns) {
    var dataX = "{'fname':'pippo'}";

    $.ajax({
            type: "POST",
            url: server + "/Reaction.asmx/TestJson",
            data: dataX,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: Success,
            error: Error
        });
    
    function Success(data, status) {
        alert(data.d)
    }
 
    function Error(request, status, error) {
        alert(request.statusText);
        $("#result").append(request.responseText);
    }
}

function getTest() {
    var dataX = "{'cns':''}";
    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetTest",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        $("#result").append(ret);
        return tmp.d;
    }
}

function get(webmethod, dataX) {
//    var dataX = "{'cns':''}";
    var ret = $.ajax({
        type: "POST",
        url: server + webmethod,
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {
        $("#result").append(ret);
        return tmp.d;
    }
}

function getAs(webmethod, dataX) {
//    var dataX = "{'cns':''}";
//    var dataX = "{'fname':'pippo'}";

    $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/TestJson",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Success,
        error: Error
    });

    function Success(data, status) {
        alert(data.d)
    }

    function Error(request, status, error) {
        alert(request.statusText);
        $("#result").append(request.responseText);
    }
}

function TestReaction(rxn) {
    var dataX = "{'rxn':'" + rxn + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/TestReaction",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}

function gettest() {
    var arr = [];
    arr.push("pippo");
    arr.push("pluto");
    var dataX = JSON.stringify({ 'list': arr });

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/TestArr",
        data: dataX,
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    var tmp = eval('(' + ret + ')');
    if (tmp.ExceptionType != undefined) {
        alert(tmp.Message)
        return tmp;
    }
    else {

        return tmp.d;
    }
}
