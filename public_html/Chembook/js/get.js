var getReactions = function (reaction, searchType, reactionId, gridId) {
    var dataX = '{"compound":' + JSON.stringify(reaction) + ', "searchType":"' + searchType + '", "cns":""}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/MatchBingoReaction",
        data: JSON.stringify(dataX),
        contentType: "application/json; charset=utf-8",
        processData: false,
        dataType: "json"
    });

    request.done(function( data ) {
      appendReaction(reactionId, data[0].rxn_scheme_key);  
      cgReactions(gridId, data);
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getSmileFromMol = function (mol, searchType, reactionId, gridId) {
    var dataX = '{"mol":' + JSON.stringify(mol) + '}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Convert/molToSmile",
        data: JSON.stringify(dataX)
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      var obj = {
            name: "smile",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getInchiFromMol = function (mol, searchType, reactionId, gridId) {
    var dataX = '{"mol":' + JSON.stringify(mol) + '}';

    var request = $.ajax({
        type: "POST",
        url: server + "/Convert/molToInchi",
        data: JSON.stringify(dataX)
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      var obj = {
            name: "inchi",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)
      getIupacName(data);
      getMW(data);
      getCAS(data);
      getFormula(data);

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getChemspider = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: server + "/Mirror?quest=getChemspiderId&inchi=" + inchi
    });

    request.done(function( data ) {
      var url= "http://www.chemspider.com/Chemical-Structure."+ data +".html"
      window.open(url, '_blank');  
    });
}

var getCAS = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/cas"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "CAS",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getFormula = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/formula"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "Formula",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getMW = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/mw"
    });

    request.done(function( data ) {
      //$('#containerSmile').append(data+ '\r\n')
      out = data.replace(/[\n\r]/g, ':').split(":")
      $.each(out, function( index, value ) {
        var obj = {
              name: "MW",
              info: value,
          };
        currentMolInfo.push(obj);
      });      
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getIupacName = function (inchi) {
    var request = $.ajax({
        type: "GET",
        url: "http://cactus.nci.nih.gov/chemical/structure/" + inchi + "/iupac_name"
    });

    request.done(function( data ) {
      var obj = {
            name: "Iupac Name",
            info: data,
        };
      currentMolInfo.push(obj);
      cgMolecules("#myGridSearchMol", currentMolInfo)

    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var getGusar = function (cas) {
  var url= "http://cactus.nci.nih.gov/chemical/apps/add/structure"
  window.open(url, '_blank');  
}

var getNCI = function (cas) {
  var url= "http://cactus.nci.nih.gov/ncidb2.2/nci2.2.tcl?op1=cas&data1="  +  cas + "&output=detail%20&highbondlist=1+2+3+4+5+6+7+8+9+10&highatomlist=1+2+3+4+5+6+7+8+9+10&conflist=-1&passid=&nomsg=1"
  window.open(url, '_blank');  
}

var getNIST = function (cas) {
  var url= "http://webbook.nist.gov/cgi/cbook.cgi?ID=" + cas + "&Units=SI"
  window.open(url, '_blank');  
}

var getTOXNET = function (cas) {
    var request = $.ajax({
        type: "GET",
        url: server + "/Mirror?quest=getToxnet&cas=" + cas
    });

    request.done(function( data ) {
      var url1= "http://toxgate.nlm.nih.gov/cgi-bin/sis/search2/f?" + data + ":1"
      window.open(url1, '_blank'); 
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });      
}

var get3D = function (cas) {
  var url= "http://cactus.nci.nih.gov/chemical/structure/" + cas + "/twirl"
  window.open(url, '_blank');  
}

var getChemIdPlus = function (cas) {
  var url= "http://chem.sis.nlm.nih.gov/chemidplus/rn/" + cas
  window.open(url, '_blank');  
}
