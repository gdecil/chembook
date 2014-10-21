var server = window.location.protocol + "//" + window.location.host;
var exp;
var expCurrent;
var arrReactive = [];
var objReactive = {};
var curNotebook, curPage, curEnumVal;
var rxnQ;

$(function () {

    $("#dialog-Print").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            Add: function () {
                var title = $(".ui-dialog-title")[0].innerHTML;
                if (title.indexOf("Chemtools") >= 0) {
                    if (title.indexOf("Reagent") >= 0) {
                        var mw = $("#batchMW")[0].value ;
                        var mf = $("#batchMF")[0].value;
                        
                        if (mw==undefined || mw==0) {
                            alert("Please select a reagent");
                            return;
                        }
                        loadReagents(mw, mf, $("#molfile")[0].value);
                        //alert("1");
                    }
                    else {
                        var mw = $("#batchMW")[0].value;
                        var mf = $("#batchMF")[0].value;
                        if (mw == undefined || mw == 0) {
                            alert("Please select a Product");
                            return;
                        }
                        loadProducts(mw, mf, $("#molfile")[0].value);
                    }
                }
                else {
                    if (title.indexOf("Reagent") >= 0) {
                        var mw = $("#batchMW")[0].value;
                        var mf = $("#batchMF")[0].value;
                        if (mw == undefined || mw == 0) {
                            alert("Please select a reagent");
                            return;
                        }
                        var formul = getRowSelected('#myGridFormFind');
                        if (formul.STRUCTURE_ID==undefined) {
                            alert("Please select a formulation");
                            return;
                        }
                        loadReagents(mw, mf, $("#molfile")[0].value);

                    }
                    else if (title.indexOf("Solvent") >= 0) {
                        var mw = $("#batchMW")[0].value;
                        var mf = $("#batchMF")[0].value;
                        if (mw == undefined || mw == 0) {
                            alert("Please select a Solvent");
                            return;
                        }
                        var formul = getRowSelected('#myGridFormFind');
                        if (formul.STRUCTURE_ID == undefined) {
                            alert("Please select a formulation");
                            return;
                        }
                        loadSolvent(mw, mf, $("#molfile")[0].value);

                    }
                    else {
                        var mw = $("#batchMW")[0].value;
                        var mf = $("#batchMF")[0].value;
                        if (mw == undefined || mw == 0) {
                            alert("Please select a Product");
                            return;
                        }
                        var formul = getRowSelected('#myGridFormFind');
                        if (formul.STRUCTURE_ID == undefined) {
                            alert("Please select a formulation");
                            return;
                        }
                        loadProducts(mw, mf, $("#molfile")[0].value);
                    }
                }
                $(this).dialog("close");
            }
},
        close: function () {
            //            allFields.val("").removeClass("ui-state-error");
        }
    });
});

$(function () {
    $("#dialog-Find").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            "Add To Procedure": function () {
                //var editor = CKEDITOR.instances["editor1"];
                //if (editor != undefined) {

                //    editor.setData(toAdd + tmp);
                //}
                var editor = CKEDITOR.instances["editor1"];
                var tmp = editor.getData();

                var id = $("#myGrid").jqGrid('getGridParam', 'selrow');
                var name = $("#myGrid").jqGrid('getCell', id, 'NAME');
                var form = $("#myGrid").jqGrid('getCell', id, 'FORMULATION');
                if (id == undefined) {
                    alert('Select a Formulation')
                    return
                }
                var idForm = $("#myGridForm").jqGrid('getGridParam', 'selrow');
                var idBottle = $("#myGridForm").jqGrid('getCell', idForm, 'BOTTLE_ID');
                var density = $("#myGridForm").jqGrid('getCell', idForm, 'DENSITY');
                var purity = $("#myGridForm").jqGrid('getCell', idForm, 'PURITY');
                var loc1 = $("#myGridForm").jqGrid('getCell', idForm, 'STORAGE_LOCATION');
                var loc2 = $("#myGridForm").jqGrid('getCell', idForm, 'STORAGE_SUBLOCATION');
                var risk = $("#myGridForm").jqGrid('getCell', idForm, 'RISK_CODES');
                var risk1 = $("#myGridForm").jqGrid('getCell', idForm, 'RISK_SYMBOLS');
                var risk2 = $("#myGridForm").jqGrid('getCell', idForm, 'SAFETY_CODES');
                if (idForm == undefined) {
                    alert('Select a Botlle')
                    return
                }
                var toAdd = "<p>Id:" + id + "<br> Name: " + name + "<br> Formulation: " + form + "<br></p>";
                toAdd = toAdd + "<p>IdBottle:" + idBottle + "<br> Density: " + density + "<br> Purity: " + purity + "<br> Location: " + loc1 + "-" + loc2 + "<br></p>";
                toAdd = toAdd + "<p>Risk Codes:" + risk + "<br> Risk Symbols: " + risk1 + "<br> Safety Codes: " + risk2 + "<br></p>";
                editor.setData(toAdd + tmp);
                if (expCurrent != undefined) {
                    expCurrent.isProcedureChanged = true;
                    expCurrent.WorkUp = toAdd + tmp;
                }

                //$(this).dialog("close");
            }
        },
        close: function () {
        }
    });
});

$(function () {
    $("#dialog-Ketcher").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            "Add To Enumeration": function () {
                var ketcher = getKetcher();
                if (ketcher) {
                    rxnQ = ketcher.getMolfile();
                    if (rxnQ.length > 105) {
                        var linksContainer = $('#reactEnum'),
                            baseUrl;
                        var imgRxn = getReactionImage(rxnQ);
                        baseUrl = 'data:image/x-png;base64,' + imgRxn;
                        linksContainer.html("");
                        $('<a/>')
                            .append($('<img>').prop('src', baseUrl))
                            .prop('href', baseUrl)
                            .prop('title', "")
                            .attr('data-dialog', '')
                            .appendTo(linksContainer);
                    }
                    else {
                        alert("Please insert a reaction");
                    }

                }
                $(this).dialog("close");
            }
        },
        close: function () {
        }
    });
});

$(function () {
    $("#dialog-Reactive").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            "Add To Reactive": function () {
                var sdf = $('#taReactive')[0].value;
                var listName = $('#listName')[0].value;
                objReactive[listName] = sdf;
                //list[listName] = sdf;
                if (listName=="") {
                    alert("Please insert a list Name");
                    return;
                }
                if (sdf.length > 0) {
                    viewReactives(sdf,listName);
                }
                else {
                    alert("Please insert a sdf");
                    return;
                }
                $(this).dialog("close");
            }
        },
        close: function () {
        }
    });
});

$(function () {
    $("#dialog-Enum").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            }
            //"??": function () {                
            //    $(this).dialog("close");
            //}
        },
        close: function () {
        }
    });
});

$(function () {
    $("#dialog-Input").dialog({
        autoOpen: false,
        height: 600,
        width: 1000,
        modal: true,
        buttons: {
            Cancel: function () {
                var lbl = $("#lblInput")[0].value;
                //if (lbl == "Experiment Changement") {
                //    expCurrent.toChange = "N";
                //}
                $(this).dialog("close");
            },
            "OK": function () {                
                $(this).dialog("close");
                var lbl = $("#lblInput")[0].value;
                var inp = $("#txtInput")[0].value;
                if (lbl == "Enumerated Reaction Experiment") {
                    saveReactEnum(inp);
                }
                else if (lbl == "Remove Reactions List") {
                    removeList(inp);
                }
                else if (lbl == "Amount in mMole") {
                    viewEnum(inp);
                }
                else if (lbl == "Experiment") {
                    var tmp = inp.split("-");
                    expCurrent = new Experiment(tmp[0], tmp[1]);
                    if (expCurrent.GeneralDataReaction == null) {
                        alert('The experiment ' + inp + ' does not exist')
                        return
                    }
                    expCurrent.delExperiment();
                    openRegister();
                }
                else if (lbl == "Experiment Changement") {
                    curNotebook, curPage, curEnumVal;
                    if (curEnumVal == "" || curEnumVal == undefined) {
                        openExperiment(curNotebook, curPage, self)
                    }
                    else {
                        openExperimentEnum(curNotebook, curPage, curEnumVal, self)
                    }
                }

                $(this).dialog("close");
            },
            "All List": function () {
                removeList("all");
                $(this).dialog("close");
            }
    },
        close: function () {
        }
    });
});

function popupChemtools() {
    $('#popupChemtools').w2popup({
        title: 'Search Reagenti in Chemtools',
        //body: '<div class="w2ui-centered"><div>This is text inside the popup</div></div>',
        buttons: '<input type="button" value="Close" onclick="w2popup.close();"> ' +
                      '<input type="button" value="Lock" onclick="w2popup.lock(\'Loading\', true); ' +
                      '		setTimeout(function () { w2popup.unlock(); }, 2000);">',
        width: 1000,
        height: 600,
        overflow: 'hidden',
        color: '#333',
        speed: '0.3',
        opacity: '0.8',
        modal: true,
        showClose: true,
        showMax: true,
        onOpen: function (event) { console.log('open'); },
        onClose: function (event) { console.log('close'); },
        onMax: function (event) { console.log('max'); },
        onMin: function (event) { console.log('min'); },
        onKeydown: function (event) { console.log('keydown'); }
    });
}

$(function () {
    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };
    $("#accordion").accordion({
        icons: icons,
        heightStyle: "content"
    });
    $("#toggle").button().click(function () {
        if ($("#accordion").accordion("option", "icons")) {
            $("#accordion").accordion("option", "icons", null);
        } else {
            $("#accordion").accordion("option", "icons", icons);
        }
    });
});

$(function () {
    $("#tree").dynatree({
        title: "Users Notebooks",
        fx: { height: "toggle", duration: 200 },
        autoFocus: false,
        selectMode: 1,
        // Image folder used for data.icon attribute.
        imagePath: "skin-custom/",
        onSelect: function (node) {
            //alert("You selected " + node);
        },
        onActivate: function (node) {
            var level = node.getLevel();
            if (level==3) {
                node.toggleSelect();
                viewExperiment(node.parent.data.title, node.data.title, true);
                if (expCurrent.isEnumerated) {
                    if (node.countChildren() == 0) {
                        for (var i = 0; i < expCurrent.CountEnumerated; i++) {
                            var childNode = node.addChild({
                                title: "My new node",
                                tooltip: "This folder and all child nodes were added programmatically."
                            });
                            childNode.expand(true);
                        }
                        node.reloadChildren(function (node, isOk) {
                            if (!isOk) alert("Node " + node + " could not be reloaded.");
                        });
                    }
                }
            }
            else if (level==4) {
                viewExperimentEnum(node.parent.parent.data.title, node.parent.data.title, node.data.title, true);
            }
            else if (level == 2) {
                if (! $('#txtNotebook').prop('disabled')) {
                    $("#txtNotebook").val(node.data.title);
                }
            }
        },
        initAjax: {
            type: "POST",
            url: server + "/Reaction.asmx/GetUsersFullname",
            contentType: "application/json; charset=utf-8",
            data: "{'cns':''}"
        },
        onExpand: function (expand, node) {
            if (expand) {
                node.removeChildren();
                exp = new Experiment(node.parent.data.title, node.data.title);
                addNode(node);
            }
        },
        onLazyRead: function (node) {
            addNode(node);
        }
    });
});

function addNode(node) {
    var level = node.getLevel();
    if (level == 2) {
        node.appendAjax({
            type: "POST",
            url: server + "/Reaction.asmx/GetPagesNotebook",
            contentType: "application/json; charset=utf-8",
            data: "{'cns':'','notebook':'" + node.data.title + "'}"
        });

    }
    else if (level == 1) {
        if (node.data.icon.indexOf("PersonIcon") >= 0) {
            node.appendAjax({
                type: "POST",
                url: server + "/Reaction.asmx/GetUserNotebooks",
                contentType: "application/json; charset=utf-8",
                data: "{'cns':'','userFullname':'" + node.data.title + "'}"
            });
        }
        else {

        }
    }
    else if (level==3) {
        if (expCurrent.isEnumerated) {
            enumerated = expCurrent.getEnumeratedNumbers();
            if (node.countChildren() == 0) {
                for (var i = 0; i < enumerated.length; i++) {
                    var childNode = node.addChild({
                        title: enumerated[i][0].EnumNumber,
                        tooltip: "Enumerated Reactions"
                    });
                    childNode.expand(true);
                }
                node.reloadChildren(function (node, isOk) {
                    if (!isOk) alert("Node " + node + " could not be reloaded.");
                });
            }
        }

    }
    //if (node.data.icon == null) {
    //}
    //else {
    //}
}

function openAttach() {
    downloadURL('sample.pdf');
}

function openDecomp() {
    window.open(server + "/ChemEln.html?tool=decomp", "_self");
}

function openEnum() {
    window.open(server + "/ChemEln.html?tool=enum", "_self");
}

function openLogin() {
    window.open(server + "/ChemEln.html?tool=", "_self");
}

function openSearch() {
    window.open(server + "/ChemEln.html?tool=search", "_self");
}

function openRegister() {
    window.open(server + "/ChemEln.html?tool=register", "_self");
}

function openView(notebook,page, self) {
    if (notebook == undefined || notebook == "undefined") {
//        alert("TODO ask for esperiment");
    }
    if (self) {
        window.open(server + "/ChemEln.html?tool=view&notebook=" + notebook + "&page=" + page, "_self");
    }
    else {
        window.open(server + "/ChemEln.html?tool=view&notebook=" + notebook + "&page=" + page);
    }
}

function openUpdate(notebook, page, self) {
    if (notebook == undefined || notebook == "undefined") {
        //        alert("TODO ask for esperiment");
    }
    if (self) {
        window.open(server + "/ChemEln.html?tool=update&notebook=" + notebook + "&page=" + page, "_self");
    }
    else {
        window.open(server + "/ChemEln.html?tool=update&notebook=" + notebook + "&page=" + page);
    }
}

function cleareExp() {
    $('.viewTxt').val("")
    $('.notenabled').prop("disabled", false);

    $('#TextAreaLiter').html("")
    $('#reaction').html("")
    var editor = CKEDITOR.instances["editor1"];
    if (editor != undefined) {
        editor.setData("");
    }
    //var ketcher = getKetcher();

    //var empty  = "" +
    //"Ketcher 07211409542D 1   1.00000     0.00000     0" +
    //"" +
    //"0  0  0     0  0            999 V2000" +
    //"M  END" +
    //"";
    //ketcher.setMolecule(empty);

    var grid = $("#myProducts");
    grid.jqGrid('GridUnload');
    var grid = $("#myReactant");
    grid.jqGrid('GridUnload');
}

function createNewExp() {
    var nb = $("#txtNotebook").val()
    nb = pad(nb, 8)
    $("#txtNotebook").val(nb)

    if (nb.length > 8) {
        alert('Max notebook length is 8 characters')
        return
    }
    
    if (!$.isNumeric(nb)) {
        alert('The notebook has to be numeric')
        return
    }
    if ($('#txtNotebook').prop('disabled')) {        
        cleareExp();
        $("#txtNotebook").val(nb)
        var page = getNextPage(nb)
        $("#txtPage").val(pad($.parseJSON(page)[0].MAXEXP,4))
    }
    else {
        if (nb=="") {
            alert('Please select o insert a notebook')
        }
        else {
            var page = getNextPage(nb)
            if ($.parseJSON(page) == -1) {
                alert("The notebook does not belong to you");
            }
            else if ($.parseJSON(page) == 1) {
                $("#txtPage").val('0001')
            }
            else {
                $("#txtPage").val(pad($.parseJSON(page)[0].MAXEXP, 4))
            }
        }
    }
}

function Clear() {
    cgReactionsClear();
    $('#reaction').html("")
}

function copyExp() {
    var nb = $("#txtNotebook").val()
    var page = getNextPage(nb)
    $("#txtPage").val(pad($.parseJSON(page)[0].MAXEXP, 4))
    editReaction();
    regAll();
}

function deleteFile() {
    expCurrent.delAttachement($.session.get("username").toUpperCase(), $('#txtDocName').val());
}

function editReaction() {
    if (expCurrent != undefined) {
        expCurrent.isSchemeChanged = true;
    }
    $("#ketcherContainer").show();
    $("#resizeMolA").hide();
    $("#editReaction").hide();
    var ketcher = getKetcher();
    if (expCurrent != undefined) {
        if (expCurrent.Rxn != 'empty') {
            ketcher.setMolecule(expCurrent.Rxn);
        }
    }
}

function editKetcher() {
    if (expCurrent != undefined) {
        expCurrent.isSchemeChanged = true;
    }
    $("#ketcherContainer").show();
    $("#resizeMolA").hide();
    $("#editReaction").hide();
}

function getRXNinKetcher( rxnId)
{
    var rea = $.parseJSON(getReaction(rxnId));
//                    $('#text1').append('ciao');
    var ketcher = getKetcher();
    var struc= rea[0].REACTION;
    ketcher.setMolecule(struc);
//    $('#text1').append(rea[0].REACTION);
//			var ketcher = getKetcher();
//			
//			if (ketcher)
//				$('textarea').value = ketcher.getMolfile();
}     

function getRXN( rxnId)
{
    $('#reaction').html("")
   appendReaction('#reaction',rxnId);
}     

function getMolecule(batch, db, type) {
    $('#batch').html("")
    appendMolecule('#batch', batch, db, type);
}

function searchSSS() {
    Clear();
    var ketcher = getKetcher();
    if (ketcher){
        var rxn =ketcher.getMolfile();
        if (rxn.length > 105) {
            var rxnIDs = getReactions(rxn,"SSS")
            getRXN( $.parseJSON(rxnIDs)[0].RXN_SCHEME_KEY);  
            cgReactions($.parseJSON(rxnIDs));
        }
        else {
            var rxnIDs = getReactions("","SSS")
            getRXN( $.parseJSON(rxnIDs)[0].RXN_SCHEME_KEY);  
            cgReactions($.parseJSON(rxnIDs));
            
//            $('.sideButtonCell').hide(); 
//            alert("Please insert a reaction to search");
        }

    }
}

function searchText(querytype) {
    var query = $('.query');
    var queryTxt = "";
    var field = "";
    var ap = "";
    $.each(query, function (n, v) {
        switch (v.id) {
            case 'txtTitle':
                field = "SUBJECT";
                ap = "'";
                break;
            case 'txtLitRef':
                field = "LITERATURE_REF";
                ap = "'";
                break;
            case 'txtProject':
                field = "PROJECT_CODE";
                ap = "'";
                break;
            case 'txtBatchCrea':
                field = "FULLNAME";
                ap = "'";
                break;
            case 'txtNotebook':
                field = "NOTEBOOK";
                ap = "'";
                break;
            case 'txtPage':
                field = "EXPERIMENT";
                ap = "'";
                break;
            case 'txtDateCrea':
                field = "CREATION_DATE";
                ap = "'";
                break;
            case 'txtFromRxn':
                field = "CONTINUED_FROM_RXN";
                ap = "'";
                break;
            case 'txtToRxn':
                field = "CONTINUED_TO_RXN";
                ap = "'";
                break;
            case 'txtSuccRea':
                field = "SUCCESSFUL";
                ap = "'";
                break;
            case 'txtYield':
                field = "YIELD";
                ap = "";
                break;
        }
        if (v.value != "") {
            queryTxt = queryTxt + field + ' ' + v.value + ' ' + querytype + ' ';
        }
    });
    if (querytype == 'and') {
        queryTxt=queryTxt.slice(0,-5)
    }
    else {
        queryTxt = queryTxt.slice(0, -4)
    }
    var rxnIDs = getReactionsText(queryTxt)
    getRXN($.parseJSON(rxnIDs)[0].RXN_SCHEME_KEY);
    cgReactions($.parseJSON(rxnIDs));
}

function refreshSchema() {
    $('#reaction').html("");
    $("#ketcherContainer").hide();
    $("#resizeMolA").show();
    $("#editReaction").show();

    appendReaction('#reaction', expCurrent.Rxn_scheme_key);

}

function refreshExperiment() {
    if (expCurrent.isEnumerated) {
        viewExperimentEnum(expCurrent.notebook, expCurrent.page, expCurrent.enumVal, true);
    }
    else {
        viewExperiment(expCurrent.notebook, expCurrent.page, true)
    }
}

function regSchema() {
    if (expCurrent==undefined) {
        alert("Please select a reaction")
        return
    }
    var ketcher = getKetcher();
    var rxn = ketcher.getMolfile();

    expCurrent.setRxn(rxn);
    expCurrent.updateSchema();
    refreshSchema();
    ketcher.setMolecule(rxn);
    //refreshExperiment();
}

function regStoic() {
    if (expCurrent == undefined) {
        var expId = $("#txtNotebook").val() + "-" + $("#txtPage").val();
        var tmp = expId.split("-");
        if ($("#txtNotebook").val() == "" || $("#txtPage").val() == "") {
            alert("Please insert a experiment to register")
            return;
        }
        expCurrent = new Experiment(tmp[0], tmp[1]);
    }

    expCurrent.Reagents = $("#myReactant").jqGrid('getGridParam', 'data');
    expCurrent.Products = $("#myProducts").jqGrid('getGridParam', 'data');
    
    expCurrent.updateStoic();
}

function regWork() {
    if (expCurrent == undefined) {
        var expId = $("#txtNotebook").val() + "-" + $("#txtPage").val();
        var tmp = expId.split("-");
        if ($("#txtNotebook").val() == "" || $("#txtPage").val() == "") {
            alert("Please insert a experiment to register")
            return;
        }
        expCurrent = new Experiment(tmp[0], tmp[1]);
    }
    var editor = CKEDITOR.instances["editor1"];
    if (editor != undefined) {
        expCurrent.WorkUp = editor.getData();
        expCurrent.updateProcedura();
    }
    else {
        alert('Check Procedure')
    }
}

function regDetail() {
//    alert("Men at work")
    if (expCurrent == undefined) {
        var expId = $("#txtNotebook").val() + "-" + $("#txtPage").val();
        var tmp = expId.split("-");
        if ($("#txtNotebook").val() == "" || $("#txtPage").val() == "") {
            alert("Please insert a experiment to register")
            return;
        }
        expCurrent = new Experiment(tmp[0], tmp[1]);
    }

    var expGen = new ExpGen();

    expGen.SUBJECT = $("#txtTitle").val();
    expGen.YIELD = $("#txtYield").val();
    expGen.PROJECT_CODE = $("#txtProject").val();
    expGen.BATCH_CREATOR = $("#txtBatchCrea").val();
    expGen.NOTEBOOK = expCurrent.notebook;
    expGen.EXPERIMENT = expCurrent.page;
    expGen.CREATION_DATE = $("#txtDateCrea").val();
    expGen.CONTINUED_FROM_RXN = $("#txtFromRxn").val();
    expGen.CONTINUED_TO_RXN = $("#txtToRxn").val();
    expGen.PROJECT_ALIAS = $("#txtAlias").val();
    expGen.ISSUCCESSFUL = $("#txtSussRea").val();
    expGen.LITERATURE_REF = $("#TextAreaLiter").val();
    if ($.session.get("username") == undefined) {
        alert("You have to login");
        return;
    }
    expGen.OWNER_USERNAME = $.session.get("username").toUpperCase();

    expCurrent.setGenData(expGen);

    if (expCurrent.RXN_SCHEME_KEY == "") {
        expCurrent.insertDetail();
    }
    else {
        expCurrent.updateDetail();
    }

}

function regAll() {
    var expId = $("#txtNotebook").val() + "-" + $("#txtPage").val();
    var tmp = expId.split("-");
    if ($("#txtNotebook").val() == "" || $("#txtPage").val() == "") {
        alert("Please insert a experiment to register")
        return;
    }
    var expNew = new Experiment(tmp[0], tmp[1]);
    var expGen = new ExpGen();

    expGen.SUBJECT = $("#txtTitle").val();
    expGen.YIELD = $("#txtYield").val();
    expGen.PROJECT_CODE = $("#txtProject").val();
    expGen.BATCH_CREATOR = $("#txtBatchCrea").val();
    expGen.NOTEBOOK = tmp[0];
    expGen.EXPERIMENT = tmp[1];
    expGen.CREATION_DATE = $("#txtDateCrea").val();
    expGen.CONTINUED_FROM_RXN = $("#txtFromRxn").val();
    expGen.CONTINUED_TO_RXN = $("#txtToRxn").val();
    expGen.PROJECT_ALIAS = $("#txtAlias").val();
    expGen.ISSUCCESSFUL = $("#txtSussRea").val();
    expGen.LITERATURE_REF = $("#TextAreaLiter").val();
    if ($.session.get("username")==undefined) {
        alert("You have to login");
        return;
    }
    expGen.OWNER_USERNAME = $.session.get("username").toUpperCase();

    expNew.setGenData(expGen);

    var ketcher = getKetcher();

    var rxn = ketcher.getMolfile();

    expNew.Rxn = rxn;

    if (rxn.length < 110) {
        
    }
    expNew.Reagents = $("#myReactant").jqGrid('getGridParam', 'data');
    expNew.Products = $("#myProducts").jqGrid('getGridParam', 'data');

    var editor = CKEDITOR.instances["editor1"];
    if (editor != undefined) {
        expNew.WorkUp = editor.getData();
    }

    expNew.insertExperiment();

    expCurrent = new Experiment(tmp[0], tmp[1]);
    var tree = $("#tree").dynatree("getTree");
    tree.reload()

    refreshExperiment();
}

function searchExact() {
    Clear();
    var ketcher = getKetcher();
    if (ketcher){
        var rxn =ketcher.getMolfile();
        if (rxn.length > 105) {
            var rxnIDs = getReactions(rxn,"Exact")
            getRXN( $.parseJSON(rxnIDs)[0].RXN_SCHEME_KEY);  
            cgReactions($.parseJSON(rxnIDs));
        }
        else {
            alert("Please insert a reaction to search");
        }

    }

//            $('textarea').value = ketcher.getMolfile();
}

function getKetcher()
{
        var frame = null;

        if ('frames' in window && 'ketcherFrame' in window.frames)
                frame = window.frames['ketcherFrame'];
        else
                return null;

        if ('window' in frame)
                return frame.window.ketcher;
}

    function viewAccordion() {
        $(".toggle-content").hide();
        $(".toggle-title").click(function () {
            $(this).next(".toggle-content").slideToggle("normal");
            $(this).toggleClass('active');
            if (this.id =="workup") {
                var editor = CKEDITOR.instances["editor1"];
                if (editor != undefined) {
                    editor.on('change', function () {
                        if (expCurrent != undefined) {
                            expCurrent.isProcedureChanged = true;
                        }
                    });
                    if (expCurrent != undefined) {
                        editor.setData(expCurrent.WorkUp);
                    }
                }                
            }
        });
    }

    function viewAccordion1() {
        $(function () {
            var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
            };
            $("#accordionView").accordion({
                icons: icons,
                collapsible: false,
                heightStyle: "content"
            });
            $("#toggle").button().click(function () {
                if ($("#accordionView").accordion("option", "icons")) {
                    $("#accordionView").accordion("option", "icons", null);
                } else {
                    $("#accordionView").accordion("option", "icons", icons);
                }
            });
            $("#header1").click(function (e) {
                return false;
                $("#accordionView").accordion("option", "icons", false);
            });
        });
        $('#accordionView .accClicked')
                .off('click')
                .click(function () {
                    $(this).next().toggle('fast');
                });
            }

    function clearAttach() {
        var grid = $("#myAttach");
        grid.jqGrid('GridUnload');

        $('#txtDocName').val("")
        $('#txtDocDesc').val("")
        $('#txtDocFile').val("")
        $('#downFile').html("")

    }

    function viewAttach(att) {
        $('#txtDocName').val(att.DOCUMENT_NAME).css('width', '400px')
        $('#txtDocDesc').val(att.DOCUMENT_DESCRIPTION).css('width', '400px')
        $('#txtDocFile').val(att.ORIGINAL_FILE_NAME).css('width', '600px')
        var fileName = getAttFileName(att.ATTACHEMENT_KEY);
        $('#downFile').html('<a href="attachements/' + fileName + '">' + fileName + '</a>')
    }

function loadSchema(rxn) {
    var ketcher = getKetcher();
    ketcher.setMolecule(rxn);
}

function loadReagents(mw, mf, molfile) {
    var formul = getRowSelected('#myGridFormFind');

    var reags = jQuery("#myReactant").getRowData()
    if (reags.length == undefined) {
        var reags = [];
    }
    var reag = {};

    reag.id = reags.length + 1
    reag.NOTEBOOK= "";
    reag.EXPERIMENT= "";
    reag.CHEMICAL_NAME= formul.FORMULATION_NAME;
    reag.BATCH_MW_VALUE= mw;
    reag.MOLECULAR_FORMULA= mf;
    reag.BATCH_TYPE = "REAGENT";
    reag.MOLE_VALUE= "";
    reag.MOLE_UNIT_CODE= "";
    reag.PURITY_VALUE = parseFloat(formul.PURITY, 10);
    reag.PURITY_UNIT_CODE= "";
    reag.VOLUME_VALUE= "";
    reag.VOLUME_UNIT_CODE= "";
    reag.MOLARITY_VALUE= "";
    reag.MOLARITY_UNIT_CODE= "";
    reag.DENSITY_VALUE = parseFloat(formul.DENSITY, 10);
    reag.DENSITY_UNIT_CODE= "";
    reag.WEIGHT_VALUE= "";
    reag.WEIGHT_UNIT_CODE= "";
    reag.CAS_NUMBER = formul.CAS_NUMBER;
    reag.USER_HAZARD_COMMENTS = formul.RISK_CODES + "; "+ formul.RISK_SYMBOLS + "; " + formul.SAFETY_CODES;

    reags.push(reag);

    var gridR = "#myReactant",
        pagerR = '#reactantspager',
        captionR = "Reagents";

    $("#gridR").html("");
    var html = "                                    <table id='myReactant'></table>" +
    "                                    <div id='reactantspager'></div> ";
    $("#gridR").append(html);

    cgProductsReagentsSave(reags, gridR, pagerR, captionR);
    var ketcher = getKetcher();

    var rxn = ketcher.getMolfile();
    var struc = createReaction(rxn, "", molfile);

    ketcher.setMolecule(struc);

}

function loadSolvent(mw, mf, molfile) {
    var formul = getRowSelected('#myGridFormFind');

    var reags = jQuery("#myReactant").getRowData()
    if (reags.length == undefined) {
        var reags = [];
    }
    var reag = {};

    reag.NOTEBOOK = "";
    reag.EXPERIMENT = "";
    reag.CHEMICAL_NAME = formul.FORMULATION_NAME;
    reag.BATCH_MW_VALUE = mw;
    reag.MOLECULAR_FORMULA = mf;
    reag.BATCH_TYPE = "SOLVENT";
    reag.MOLE_VALUE = "";
    reag.MOLE_UNIT_CODE = "";
    reag.PURITY_VALUE = parseFloat(formul.PURITY, 10);
    reag.PURITY_UNIT_CODE = "";
    reag.VOLUME_VALUE = "";
    reag.VOLUME_UNIT_CODE = "";
    reag.MOLARITY_VALUE = "";
    reag.MOLARITY_UNIT_CODE = "";
    reag.DENSITY_VALUE = parseFloat(formul.DENSITY, 10);
    reag.DENSITY_UNIT_CODE = "";
    reag.WEIGHT_VALUE = "";
    reag.WEIGHT_UNIT_CODE = "";
    reag.CAS_NUMBER = formul.CAS_NUMBER;
    reag.USER_HAZARD_COMMENTS = formul.RISK_CODES + "; " + formul.RISK_SYMBOLS + "; " + formul.SAFETY_CODES;

    reags.push(reag);

    var gridR = "#myReactant",
        pagerR = '#reactantspager',
        captionR = "Reagents";

    $("#gridR").html("");
    var html = "                                    <table id='myReactant'></table>" +
    "                                    <div id='reactantspager'></div> ";
    $("#gridR").append(html);

    cgProductsReagentsSave(reags, gridR, pagerR, captionR);
    var ketcher = getKetcher();

    var rxn = ketcher.getMolfile();
    var struc = createReaction(rxn, "", molfile);

    ketcher.setMolecule(struc);

}

function loadProducts(mw, mf, molfile) {
    var formul = getRowSelected('#myGridFormFind');

    var reags = jQuery("#myProducts").getRowData()
    if (reags.length == undefined) {
        var reags = [];
    }
    var reag = {};

    reag.NOTEBOOK = "";
    reag.EXPERIMENT = "";
    reag.CHEMICAL_NAME = formul.FORMULATION_NAME;
    reag.BATCH_MW_VALUE = mw;
    reag.MOLECULAR_FORMULA = mf;
    reag.BATCH_TYPE = "PRODUCT";
    reag.MOLE_VALUE = "";
    reag.MOLE_UNIT_CODE = "";
    reag.PURITY_VALUE = parseFloat(formul.PURITY, 10);
    reag.PURITY_UNIT_CODE = "";
    reag.VOLUME_VALUE = "";
    reag.VOLUME_UNIT_CODE = "";
    reag.MOLARITY_VALUE = "";
    reag.MOLARITY_UNIT_CODE = "";
    reag.DENSITY_VALUE = parseFloat(formul.DENSITY, 10);
    reag.DENSITY_UNIT_CODE = "";
    reag.WEIGHT_VALUE = "";
    reag.WEIGHT_UNIT_CODE = "";
    reag.CAS_NUMBER = formul.CAS_NUMBER;
    reag.USER_HAZARD_COMMENTS = formul.RISK_CODES + "; " + formul.RISK_SYMBOLS + "; " + formul.SAFETY_CODES;

    reags.push(reag);

    var gridR = "#myProducts",
        pagerR = '#Productspager',
        captionR = "Products";

    $("#gridP").html("");
    var html = "                                    <table id='myProducts'></table>" +
    "                                    <div id='Productspager'></div> ";
    $("#gridP").append(html);

    cgProductsReagentsSave(reags, gridR, pagerR, captionR);

    var ketcher = getKetcher();

    var rxn = ketcher.getMolfile();
    var struc = createReaction(rxn, molfile, "");

    ketcher.setMolecule(struc);
}

function loadStoic(rxn, counter, mole) {
    if (rxn.length == 102) {
        clearStoic();
        return;
    }

    if (rxn=="") {
        var mydataR = $.parseJSON(expCurrent.getReagents()),
            divGR = $("#gridR"),
            divGP = $("#gridP"),
            idRgrid = 'myReactant',
            idRpage = 'reactantspager',
            idPgrid = 'myProducts',
            idPpage = 'Productspager',
        gridR = "#myReactant",
        pagerR = '#reactantspager',
        captionR = "Reagents";

        var mydataP = $.parseJSON(expCurrent.getProducts()),
        gridP = "#myProducts",
        pagerP = '#Productspager',
        captionP = "Products";
    }
    else {
        if (counter != "") {
            var reagents = getReagentsIndigo(rxn)
            var mydataR = $.parseJSON(reagents),
            divGR = $("#gridR" + counter),
            divGP = $("#gridP" + counter),
            gridR = "#myReactant" + counter,
            pagerR = '#reactantspager' + counter,
            captionR = "Reagents",
            gridP = "#myProducts" + counter,
            pagerP = '#Productspager' + counter,
            idRgrid = 'myReactant' + counter,
            idRpage = 'reactantspager' + counter,
            idPgrid = 'myProducts' + counter,
            idPpage = 'Productspager' + counter,
            captionP = "Products";

            var products = getProductsIndigo(rxn)

            var mydataP = $.parseJSON(products);

        }
        else {
            var reagents = getReagentsIndigo(rxn)

            var mydataR = $.parseJSON(reagents),
                divGR = $("#gridR"),
                divGP = $("#gridP"),
                gridR = "#myReactant",
                pagerR = '#reactantspager',
                captionR = "Reagents",
                gridP = "#myProducts",
                pagerP = '#Productspager',
                idRgrid = 'myReactant',
                idRpage = 'reactantspager',
                idPgrid = 'myProducts',
                idPpage = 'Productspager',
                captionP = "Products";

            var products = getProductsIndigo(rxn)


            var mydataP = $.parseJSON(products);

            var molecules = FromReactionToMolecules(rxn);
        }
    }
    if (rxn != "") {
        //prendo le densita da bottles
        $.each(mydataP, function (n, v) {
            var molData = getReactionsMolecules(v.COMPOUND)
            var density = 0;
            var purity = 0;
            $.each($.parseJSON(molData), function (m, z) {
                if (z.DATABASE == "Bottles") {
                    density = z.DENSITY;
                    purity = z.PURITY;
                }
            });
            if (density != 0) {
                this.DENSITY_VALUE = density;
                this.PURITY_VALUE = purity;
            }
        });

        $.each(mydataR, function (n, v) {
            var molData = getReactionsMolecules(v.COMPOUND)
            var density = 0;
            var purity = 0;
            $.each($.parseJSON(molData), function (m, z) {
                if (z.DATABASE == "Bottles") {
                    density = z.DENSITY;
                    purity = z.PURITY;
                }
            });
            if (density != 0) {
                this.DENSITY_VALUE = density;
                this.PURITY_VALUE = purity;
            }
        });
    }


    if (mydataR==null) {
        $(gridR).jqGrid('GridUnload');
    }
    else {
        divGR.html("");
        var html = "                                    <table id='" + idRgrid + "'></table>" +
        "                                    <div id='" + idRpage + "'></div> ";
        divGR.append(html);
        cgProductsReagentsSave(mydataR, gridR, pagerR, captionR, mole);
    }

    if (mydataP==null) {
        $(gridP).jqGrid('GridUnload');
    }
    else {
        divGP.html("");
        var html = "                                    <table id='" + idPgrid + "'></table>" +
        "                                    <div id='" + idPpage + "'></div> ";
        divGP.append(html);

        cgProductsReagentsSave(mydataP, gridP, pagerP, captionP, mole)
    }
}

function updateExperiment(notebook, page, self) {
    if (expCurrent != undefined) {
        if (expCurrent.checkChanging() != "") {
            openDialog("changeExperiment")
        }
        else {
            openExperiment(notebook, page, self)
        }
    }
    else {
        openExperiment(notebook, page, self)
    }
}

function updateExperimentEnum(notebook, page, enumReac, self) {
    if (expCurrent != undefined) {
        if (expCurrent.checkChanging() != "") {
            openDialog("changeExperiment")
        }
        else {
            openExperimentEnum(notebook, page, enumReac, self)
        }
    }
    else {
        openExperimentEnum(notebook, page, enumReac, self)
    }
}

function openExperiment(notebook, page, self) {
    $('.notenabled').prop("disabled", true);
    clearAttach();

    expCurrent = new Experiment(notebook, page);

    exp = new Experiment(notebook, page);
    refreshSchema()

    loadDetails($.parseJSON(expCurrent.GeneralDataReaction)[0]);
    var editor = CKEDITOR.instances["editor1"];
    if (editor != undefined) {
        editor.setData(expCurrent.WorkUp);
    }

    $("#scheme").show();
    if (expCurrent.isEnumerated) {
        $("#viewEnRea").remove();
        $("#RScol2").append("<input id='viewEnRea' class = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' type='button' value='View Enumerated Reactions' onclick='viewEnumPop()'/>");
    }
    else {
        $("#viewEnRea").remove();
    }

    var grid = $("#myReactant");
    grid.jqGrid('GridUnload');
    var Mydata = $.parseJSON(expCurrent.getReagents());
    if (Mydata != null) {
        var gridR = "#myReactant",
            pagerR = '#reactantspager',
            captionR = "Reagents";
        cgProductsReagentsSave(Mydata, gridR, pagerR, captionR);
    }

    var grid = $("#myProducts");
    grid.jqGrid('GridUnload');
    var Mydata = $.parseJSON(expCurrent.getProducts())
    if (Mydata != null) {
        var gridR = "#myProducts",
            pagerR = '#Productspager',
            captionR = "Products";
        cgProductsReagentsSave(Mydata, gridR, pagerR, captionR);
    }

    var grid = $("#myAttach");
    grid.jqGrid('GridUnload');
    cgAttach($.parseJSON(expCurrent.getAttachement()));
}

function openExperimentEnum(notebook, page, enumReac, self) {
    $('.notenabled').prop("disabled", true);
    clearAttach();

    exp = new Experiment(notebook, page, enumReac);
    refreshSchema()
    loadDetails($.parseJSON(expCurrent.GeneralDataReaction)[0]);
    var editor = CKEDITOR.instances["editor1"];

    $("#scheme").show();
    if (expCurrent.isEnumerated) {
        $("#viewEnRea").remove();
        $("#RScol2").append("<input id='viewEnRea' class = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' type='button' value='View Enumerated Reactions' onclick='viewEnumPop()'/>");
    }
    else {
        $("#viewEnRea").remove();
    }
    var grid = $("#myReactant");
    grid.jqGrid('GridUnload');
    if (expCurrent.getReagents() != "") {
        cgReagents($.parseJSON(expCurrent.getReagents()));
    }
    else {
        cgReagents();
    }
    var grid = $("#myProducts");
    grid.jqGrid('GridUnload');
    if (expCurrent.getProducts() != "") {
        cgProducts($.parseJSON(expCurrent.getProducts()));
    }
    else {
        cgProducts();
    }
}

function viewExperiment(notebook, page, self) {
    curNotebook = notebook;
    curPage = page;
    curEnumVal = "";
    if ($('#mainContent .header')[0].innerHTML == 'Reaction Register' || $('#mainContent .header')[0].innerHTML == 'Reaction View') {
        updateExperiment(notebook, page, self)
        return;
    }

    if ($('#mainContent .header')[0].innerHTML != 'Reaction View') {
        openView(notebook, page, self)
    }
}

function viewExperimentEnum(notebook, page, enumReac, self) {
    curNotebook = notebook;
    curPage = page;
    curEnumVal = enumReac;

    if ($('#mainContent .header')[0].innerHTML == 'Reaction Register' || $('#mainContent .header')[0].innerHTML == 'Reaction View') {
        openExperimentEnum(notebook, page, enumReac, self)
        return;
    }

    if ($('#mainContent .header')[0].innerHTML != 'Reaction View') {
        openView(notebook, page, self)
    }


}

function loadDetails(details) {
    $("#txtTitle").val(details.SUBJECT).attr('size', $("#txtTitle").val().length);
    if (details.YIELD != null) {
        $("#txtYield").val(details.YIELD.toString()).attr('size', $("#txtYield").val().length);
    }
    else {
        $("#txtYield").val("");
    }
    $("#txtProject").val(details.PROJECT_CODE).attr('size', $("#txtProject").val().length);
    $("#txtBatchCrea").val(details.BATCH_CREATOR).attr('size', $("#txtBatchCrea").val().length);
    $("#txtNotebook").val(details.NOTEBOOK).attr('size', $("#txtNotebook").val().length);

    $("#txtDateCrea").val(convertJSONDate(details.CREATION_DATE)).attr('size', $("#txtDateCrea").val().length);
    $("#txtFromRxn").val(details.CONTINUED_FROM_RXN).attr('size', $("#txtFromRxn").val().length);
    $("#txtToRxn").val(details.CONTINUED_TO_RXN).attr('size', $("#txtToRxn").val().length);
    if (details.ISSUCCESSFUL != null) {
        $("#txtSussRea").val(details.ISSUCCESSFUL).attr('size', $("#txtSussRea").val().length);
    }
    else {
        $("#txtSussRea").val("");
    }
    $("#txtPage").val(details.EXPERIMENT).attr('size', $("#txtPage").val().length);

    $("#TextAreaLiter").val(details.LITERATURE_REF);
}

function login(username, password) {
    var ok = checkUserPwd(username, password);
    if (ok=="OK") {
        $.session.set("username", username);
        openSearch();
    };
}

function setMolecules() {

    if ($('#editReaction').is(":visible")) {
        loadStoic(expCurrent.Rxn, "");
    }
    else {
        var ketcher = getKetcher();
        var rxn = ketcher.getMolfile();

        loadStoic(rxn, "");
    }

    

    $("#wizard").smartWizard('goToStep', 2);
    if (expCurrent != undefined) {
        expCurrent.isStoichChanged = true;
    }
}

function checkUserIsLoggedIn() {
    var username = $.session.get("username");
    if (username == null || username == undefined || username == "") {
        alert("You are not logged in: You cannot insert or update data!")
        return false;
    };
    return true;
}

function view2() {
    var selNode = $("#tree").dynatree("getSelectedNodes");
    if (selNode[0] != undefined &  selNode[0].childList == null) {
        title = selNode[0].parent.data.title;
        selNode[0].parent.removeChildren();
        addNode(selNode[0].parent);
    }
}

function SearchCT() {
    clearSearchCT()
    $("body").toggleClass("wait");

    var type = $("div.addCT select").val();

    var title = $(".ui-dialog-title")[0].innerHTML;
    $("#batchMW")[0].value = "";
    $("#batchMF")[0].value = "";
    //$("#data").html("");
    $("#batch").html("");
    var batch = $("#txtLabels")[0].value.toUpperCase();

    if (title.indexOf("Chemtools") >= 0) {
        var batchData = $.parseJSON(getBatch(batch, "json", type));
        var ret = getMolecule(batch, "chemtools", type);
    }
    else {
        var batchData = $.parseJSON(getBottle(batch, type));
        var ret = getMolecule(batch, "bottle", type);

        var mydata = $.parseJSON(getBottleForm(batch, type));
        var grid = $("#myGridFormFind");
        grid.jqGrid('GridUnload');
        cgFormulations(mydata)
    }


    $("#batchMW")[0].value =batchData.mw;
    $("#batchMF")[0].value = batchData.mf;
    $("#molfile")[0].value = batchData.compound;

    $("body").toggleClass("wait");
}

function clearSearchCT() {
    $("#batchMW")[0].value = "";
    $("#batchMF")[0].value = "";
    $("#batch").html("");
    $("#molfile")[0].value = "";
    var grid = $("#myGridFormFind");
    grid.jqGrid('GridUnload');
}

function clearStoic() {
    $("#myReactant").jqGrid('GridUnload');
    $("#myProducts").jqGrid('GridUnload');
}

function FindAll() {

//    Clear();
    var ketcher = getKetcher();
    if (ketcher) {
        var rxn = ketcher.getMolfile();
        if (rxn.length==102) {
            rxn = expCurrent.Rxn;
        }
        $("#dialog-Find").dialog("open");
        $("#dialog-Find").dialog({ title: "Find All" });

        var rxnIDs = getReactionsData(rxn)
        var tot = [];

        $.each($.parseJSON(rxnIDs), function (m, z) {
            tot.push(z);
        });

        var molecules = FromReactionToMolecules(rxn);

        $.each($.parseJSON(molecules), function (n, v) {
            var molData = getReactionsMolecules(v.rxn)
            $.each($.parseJSON(molData), function (m, z) {
                tot.push(z);
            });
        });

        cgReactionsData(tot);
    }
}