var Experiment = function(notebook, page, enumVal) {
    this.notebook = notebook;
    this.page = page;
    this.enumVal = enumVal;
    this.id = this.notebook + "-" + this.page;
    this.GeneralDataReaction = this.GeneralData();
    this.RXN_SCHEME_KEY;
    this.Reagents;
    this.Products;
    this.Attachement;
    this.isEnumerated = this.checkEnum();
    this.Enumerated;
    this.CountEnumerated;
    this.isDetailChanged = false;
    this.isSchemeChanged = false;
    this.isStoichChanged = false;
    this.isProcedureChanged = false;

    if (this.GeneralDataReaction != "") {
        this.Rxn_scheme_key = this.GeneralDataReaction[0].rxn_scheme_key;
        this.Owner = this.GeneralDataReaction[0].owner_username;
        this.WorkUp = this.GeneralDataReaction[0].procedure;
    }

    var _rxn = this.RXN();
    if (_rxn == "" || _rxn == undefined) {
        this.Rxn = "empty";
    }
    else {
        this.Rxn = _rxn
    }
    
}

Experiment.prototype.notebook = '';
Experiment.prototype.page = '';
Experiment.prototype.id = '';
Experiment.prototype.GeneralDataReaction = '';
Experiment.prototype.Rxn_scheme_key = '';
Experiment.prototype.Rxn = '';
Experiment.prototype.WorkUp = '';
Experiment.prototype.Owner = '';
Experiment.prototype.isDetailChanged = false;
Experiment.prototype.isSchemeChanged = false;
Experiment.prototype.isStoichChanged = false;
Experiment.prototype.isProcedureChanged = false;
Experiment.prototype.toChange = "N";
Experiment.prototype.isEnumerated = false;

Experiment.prototype.sayHello = function () {
    
    alert(this.id);
};

Experiment.prototype.getAttachement = function () {
    var dataX = '{"notebook":"' + this.notebook + '","page":"' + this.page + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetAttachments",
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
};

//reagents stoic
Experiment.prototype.getReagents = function () {
	
    var dataX = JSON.stringify('{"notebook":"' + this.notebook + '","page":"' + this.page + '","enumVal":"' + this.enumVal + '"}');
//    var dataX = "{'notebook':'" + this.notebook + "','page':'" + this.page + "','enumVal':'" + this.enumVal + "'}";

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

        return tmp;
    }
};

//products stoic
Experiment.prototype.getProducts = function () {
    var dataX = JSON.stringify('{"notebook":"' + this.notebook + '","page":"' + this.page + '","enumVal":"' + this.enumVal + '"}');

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

        return tmp;
    }
};

/*
Experiment.prototype.GeneralData = function() {
    var dataX = JSON.stringify('{"notebook":"' + this.notebook + '","page":"' + this.page + '","enumVal":"' + this.enumVal + '"}');
                               
    url = server + "/Reaction.asmx/GetExperiment";
    return $.ajax(
      {
          type: "POST",
          data: dataX,
          contentType: "application/json; charset=utf-8",
          processData: false,
          dataType: "json",
          url: url 
      });
    }
*/

Experiment.prototype.GeneralData = function () {
    var dataX = JSON.stringify('{"notebook":"' + this.notebook + '","page":"' + this.page + '","enumVal":"' + this.enumVal + '"}');
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
        if (tmp.length==0) {
            this.RXN_SCHEME_KEY = "";
        }
        else {
            this.RXN_SCHEME_KEY = tmp[0].rxn_scheme_key;
        }
        return tmp;
    } 
};

Experiment.prototype.RXN = function () {
    if (this.Rxn_scheme_key == "" || this.Rxn_scheme_key == null) {
        return;
    }
    var dataX = '{"reactionId":"' + this.Rxn_scheme_key + '","cns":"" , "outType":""}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReaction",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json",
        async: false
    }).responseText;
    return ret
//    var tmp = eval('(' + ret + ')');
//    if (tmp.ExceptionType != undefined) {
//        //alert(tmp.Message)
//        return "";
//    }
//    else {
//
//        return tmp[0].reaction;
//    } 
};

//indigo calculated data
Experiment.prototype.getProductsIndigo = function () {
    var dataX = "{'rxn':'" + this.RXN() + "'}";

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
};

Experiment.prototype.getReagentsIndigo = function () {
    var dataX = "{'rxn':'" + this.RXN() + "'}";

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
};

Experiment.prototype.updateDetail = function () {
    if (insertCheck) {

    }
    if (!this.checkOwnership()) {
        return;
    }
    var tt = this.GeneralDataReaction.keyUcase()
    var dataX = '{"detail":' + JSON.stringify(tt)
    + '}';
          
    var jqxhr = $.ajax({
          type: "POST",
          url: server + "/Reaction.asmx/UpdateDetail",
          data: dataX,
          contentType: "application/json; charset=utf-8",
          processData: false,
          dataType: "json"
      })
    .done(function(data, status, headers, config) {
      if(data=="1"){
        alert('Form data saved');
      }
      else {
        alert(data);
      }
    })
    .fail(function() {
      alert('Form data save error');
    })    
};

Experiment.prototype.updateProcedura = function () {
    if (!this.checkUser()) {
        return;
    }
    if (!this.checkOwnership()) {
        return;
    }
    var dataX = '{"procedura":"' + this.WorkUp + '", "notebook":"' + this.notebook + '", "page":"' + this.page + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/UpdateProcedura",
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
        if (tmp > 0) {
            this.isProcedureChanged = false;
            alert("Procedure updated");
        }
        else {
            alert("Error updating procedure");
        }
        return tmp;
    }
};

Experiment.prototype.updateSchema = function () {
    if (!this.checkUser()) {
        return;
    }
    if (!this.checkOwnership()) {
        return;
    }
    //var dataX = "{'rxn':'" + this.Rxn + "', 'rxnId':'" + this.Rxn_scheme_key + "'}";
    var dataX = '{"rxn":"' + this.Rxn + '", "notebook":"' + this.notebook + '", "page":"' + this.page + '", "enumVal":"' + this.enumVal + '"}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/UpdateSchema",
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
        if (tmp.ret.length == 40) {
            this.isSchemeChanged = false;
            alert("Schema updated");
        }
        else {
            alert("Error updating Scheme");
        }
        return tmp.d;
    }
};

Experiment.prototype.updateStoic = function () {
    if (!this.checkUser()) {
        return;
    }
    if (!this.checkOwnership()) {
        return;
    }

//    var dataX = '{"Reagents":"' + JSON.stringify(this.Reagents).replace(/null/g, "\"\"") + '", "Products":"' + JSON.stringify(this.Products).replace(/null/g, "\"\"") + '","username":"' + $.session.get("username").toUpperCase() + '","notebook":"' + this.notebook + '", "page":"' + this.page + '"}"';
    var dataX = '{"Reagents":' + JSON.stringify(this.Reagents) + ', "Products":' + JSON.stringify(this.Products) + ',"username":"' + $.session.get("username").toUpperCase() + '","notebook":"' + this.notebook + '", "page":"' + this.page + '"}';
//    var dataY = '{"detail":' + JSON.stringify(this.GeneralDataReaction)
//    + '}';
//    var dataZ = '{"Reagents":' + JSON.stringify(this.Reagents[0]) + '}';

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/UpdateStoic",
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
        if (tmp > 0) {
            this.isStoichChanged = false;
            alert("Stoichiometry updated");
        }
        else {
            alert("Error updating Stoichiometry");
        }
        return tmp
    }
};

Experiment.prototype.checkEnum = function () {
    this.id
    var dataX = JSON.stringify('{"notebook":"' + this.notebook + '","page":"' + this.page + '"}');

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/CheckReactionsEnumerated",
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
        if (tmp.d != "") {
            if (tmp.d > 0) {
                this.CountEnumerated = tmp.d;
                return true;
            }
        }
        this.CountEnumerated = 0;
        return false;
    }
}

Experiment.prototype.checkChanging = function () {
    var ret = "";
    if (this.isDetailChanged) {
        ret = ret + "Deatails are changed \n"
    }
    if (this.isSchemeChanged) {
        ret = ret + "Reaction is changed \n"
    }
    if (this.isProcedureChanged) {
        ret = ret + "Procedure is changed \n"
    }
    if (this.isStoichChanged) {
        ret = ret + "Stoichiometry is changed \n"
    }
    return ret;
}

Experiment.prototype.checkUser = function () {
    if (!checkUserIsLoggedIn()) {
        alert("You are not logged in.");
        return false;
    }
    return true;
}

Experiment.prototype.checkOwnership = function () {
    if ($.session.get("username").toUpperCase() != this.Owner) {
        alert("You are not the owner.");
        return false;
    }
    return true;
}

Experiment.prototype.getEnumerated = function () {
    this.id
    var dataX = "{'notebook':'" + this.notebook + "','page':'" + this.page + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReactionsEnumerated",
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
        if (tmp.d != "") {
            if ($.parseJSON(tmp.d).length > 0) {
                this.Enumerated = $.parseJSON(tmp.d);
                return $.parseJSON(tmp.d);
            }
        }
        return false;
    }
}

Experiment.prototype.delExperiment = function () {
    this.id
    var dataX = "{'notebook':'" + this.notebook + "','page':'" + this.page + "'}";
    //alert(dataX);
    //return;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/DelExperiment",
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
        if (tmp.d != "") {
            if ($.parseJSON(tmp.d).length > 0) {
                return $.parseJSON(tmp.d);
            }
        }
        return false;
    }
}

Experiment.prototype.delAttachement = function (username, namedoc) {
    this.id
    var dataX = "{'notebook':'" + this.notebook + "','page':'" + this.page + "','user0':'" + username + "','namedoc0':'" + namedoc + "'}";
    //alert(dataX);
    //return; 

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/DelAttachement",
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
        if (tmp.d != "") {
            var grid = $("#myAttach");
            grid.jqGrid('GridUnload');
            cgAttach($.parseJSON(this.getAttachement()));
        }
        return false;
    }
}

Experiment.prototype.getEnumeratedNumbers = function () {
    this.id
    var dataX = "{'notebook':'" + this.notebook + "','page':'" + this.page + "'}";

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/GetReactionsEnumeratedNumbers",
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
        if (tmp.d != "") {
            if ($.parseJSON(tmp.d).length > 0) {
                this.Enumerated = $.parseJSON(tmp.d);
                return $.parseJSON(tmp.d);
            }
        }
        return false;
    }
}

Experiment.prototype.setRxn = function (rxn) {
    this.Rxn = JSON.stringify(rxn);
};

Experiment.prototype.setGenData = function (expGen) {
    this.GeneralDataReaction = expGen;
};

Experiment.prototype.setReagents = function (reagents) {
    this.Reagents = reagents;
};

Experiment.prototype.setProducts = function (products) {
    this.Products = products;
};

Experiment.prototype.insertExperiment = function () {
    if (insertCheck) {

    }

    //controlli
    //esistenza 
        //notebook
        //esperimento
    //dimensione notebook max 8
    //dimensione esperimento max 4

    //var dataX = "{'rxn':'$RXN', 'Reagents':'" + JSON.stringify(this.Reagents) + "', 'Products':'', 'workup':'', 'detail':''}"; .replace(/'/g, " ").replace(/"/g, "'")

    var dataX = "{'rxn':'" + this.Rxn
        + "', 'Reagents':'" + JSON.stringify(this.Reagents)
        + "', 'Products':'" + JSON.stringify(this.Products)
        + "', 'workup':'" + this.WorkUp
        + "', 'detail':'" + JSON.stringify(this.GeneralDataReaction)
        + "'}";
    //return;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/InsertExperiment",
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
        if (tmp.d > 0) {
            if (this.isEnumerated) {
                insertEnumeratedReaction();
                alert("Enumerated Experiment Registered");
            }
            else {
                alert("Experiment Registered");
            }
        }
        else {
            alert("Error inserting experiment");
        }
        return tmp.d;
    }
};

Experiment.prototype.insertDetail = function () {
    if (insertCheck) {

    }

    var dataX = '{"detail":' + JSON.stringify(this.GeneralDataReaction)
        + '}';
    //return;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/InsertDetail",
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
        if (JSON.parse(tmp).ret.length == 40) {
            alert("Experiment Registered");
        }
        else {
            alert("Error Registering Experiment Detail");
        }
        return tmp.d;
    }
};

Experiment.prototype.insertEnumeratedReaction = function () {
    if (insertCheck) {

    }
    var en = "";
    $.each(this.Enumerated, function (index, rxn) {
        en=en + rxn[1].RXN + "!";
    });
     
    var dataX = "{'rxn':'" + this.Rxn
    + "', 'structEnum':'" + en
    + "', 'detail':'" + JSON.stringify(this.GeneralDataReaction)
    + "'}";
    //return;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/InsertExperimentEnum",
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
        if (tmp.d > 0) {
            if (this.isEnumerated) {

            }
            else {
                alert("Scheme updated");
            }
        }
        else {
            if (tmp.d == -111) {
                //fai nulla
            }
            else {
                alert("Error Registering Query Reaction");
            }
        }
        return tmp.d;
    }
}

Experiment.prototype.insertEnumeratedBatches = function () {
    if (insertCheck) {

    }
    var dataX = "{'Reagents':'" + JSON.stringify(this.Reagents)
        + "', 'Products':'" + JSON.stringify(this.Products)
        + "', 'detail':'" + JSON.stringify(this.GeneralDataReaction)
        + "'}";
    //return;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/InsertExperimentEnumBatches",
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
        if (tmp.d > 0) {
            if (this.isEnumerated) {
                //alert("Experiment Registered");
            }
            else {
                alert("Scheme updated");
            }
        }
        else {
            if (tmp.d == -111) {
                //fai nulla
            }
            else {
                alert("Error updating Scheme");
            }
        }
        return tmp.d;
    }
}
function insertCheck() {
    if (!checkUser()) {
        //return;
    }

    if (this.GeneralDataReaction.NOTEBOOK == "") {
        alert("Please insert a Notebook")
        return false;
    }
    if (this.GeneralDataReaction.NOTEBOOK.length > 8) {
        alert("Max Notebook length = 8")
        return false;
    }
    if (this.GeneralDataReaction.EXPERIMENT == "") {
        alert("Please insert an Experiment")
        return false;
    }
    if (this.GeneralDataReaction.EXPERIMENT.length > 4) {
        alert("Max Experiment length = 4")
        return false;
    }

    if (this.GeneralDataReaction().length > 0) {
        alert('Experiment already exists');
        return false;
    }
    return true;
}
function ExpGen() {
    this.SUBJECT;
    this.TH;
    this.PROJECT_CODE;
    this.BATCH_CREATOR;
    this.NOTEBOOK;
    this.EXPERIMENT;
    this.CREATION_DATE;
    this.CONTINUED_FROM_RXN;
    this.CONTINUED_TO_RXN;
    this.PROJECT_ALIAS;
    this.BATCH_OWNER;
    this.LITERATURE_REF;
    this.OWNER_USERNAME;
    this.YIELD;
}

ExpGen.prototype.SUBJECT = '';
ExpGen.prototype.TH = '';
ExpGen.prototype.PROJECT_CODE = '';
ExpGen.prototype.BATCH_CREATOR = '';
ExpGen.prototype.NOTEBOOK = '';
ExpGen.prototype.EXPERIMENT = '';
ExpGen.prototype.CREATION_DATE = '';
ExpGen.prototype.CONTINUED_FROM_RXN = '';
ExpGen.prototype.CONTINUED_TO_RXN = '';
ExpGen.prototype.PROJECT_ALIAS = '';
ExpGen.prototype.BATCH_OWNER = '';
ExpGen.prototype.LITERATURE_REF = '';
ExpGen.prototype.YIELD = 0;


function ExpBatch() {
    this.CHEMICAL_NAME;
    this.BATCH_MW_VALUE;
    this.MOLECULAR_FORMULA;
    this.BATCH_TYPE;
    this.MOLE_VALUE;
    this.MOLE_UNIT_CODE;
    this.MOLARITY_VALUE;
    this.MOLARITY_UNIT_CODE;
    this.DENSITY_VALUE;
    this.DENSITY_UNIT_CODE;
    this.PURITY_UNIT_CODE;
    this.PURITY_VALUE;
    this.VOLUME_VALUE;
    this.VOLUME_UNIT_CODE;
    this.WEIGHT_VALUE;
    this.WEIGHT_UNIT_CODE;
    this.THEO_WT_VALUE;
    this.THEO_WT_UNIT_CODE;
    this.THEO_YLD_PCNT_VALUE;
    this.CAS_NUMBER;
    this.USER_HAZARD_COMMENTS;
}

