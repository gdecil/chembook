var reactionsEnumerated;
var      tabCounter ;

function viewEnum(mole) {
    //gettest();
    //return;
    tabCounter = 1;
    var reactions = Enumeration();
    reactionsEnumerated = $.parseJSON(reactions);
    var linksContainer = $('#links'),
            baseUrl;
    //linksContainer.html('');
    var tabs = $("#tabsV").tabs();
    tabs.find(".ui-tabs-nav").html("");
    $("#tabsV div").remove();
    $.each(reactionsEnumerated, function (index, rxn) {
        var title = $.strPad(tabCounter, 10);
        li = "<li><a href='#tabsV-" + tabCounter + "'>" + title + "</a></li>";
        var div = "<div id='tabsV-" + tabCounter + "'> <h2>Reaction n° " + tabCounter + "</h2></div>";

        tabs.find(".ui-tabs-nav").append(li);
        tabs.append(div);
        tabs.tabs("refresh");
        baseUrl = 'data:image/x-png;base64,' + rxn[0].Image;
        $('<a/>')
            .append($('<img>').prop('src', baseUrl))
            .prop('href', baseUrl)
            .prop('title', "")
            .attr('data-dialog', '')
            .appendTo($('#tabsV-' + tabCounter));
        var html =
        "                                <div id='gridR" + tabCounter + "'>" +
        "                                    <table id='myReactant" + tabCounter + "'></table>" +
        "                                    <div id='reactantspager" + tabCounter + "'></div> " +
        "                                </div>" +
        "                                <div id='gridP" + tabCounter + "'>" +
        "                                    <table id='myProducts" + tabCounter + "'></table>" +
        "                                    <div id='Productspager" + tabCounter + "'></div> " +
        "                                </div>";
        $('#tabsV-' + tabCounter).append(html);
        loadStoic(rxn[1].RXN, tabCounter, mole);
        tabCounter++;

    });
    initializeSlider();
}

function viewEnumPop() {
    $("#dialog-Enum").dialog("open");
    $("#dialog-Enum").dialog({ title: "Enumerated Reactions" });

    var linksContainer = $('#enums'),
            baseUrl;
    linksContainer.html("");
    //linksContainer.html('<h2>Enumerated Reactions<h2>');
    var enumerated = expCurrent.getEnumerated();
    $.each(enumerated, function (index, rxn) {
        baseUrl = 'data:image/x-png;base64,' + rxn[0].Image;
        $('<a/>')
            .append($('<img>').prop('src', baseUrl))
            .prop('href', baseUrl)
            .prop('title', "")
            //.attr('data-dialog', '')
            .appendTo(linksContainer);
    });
    initializeSlider();
}

function viewReactives(sdf, nameList) {

    var linksContainer = $('#reactives'),
        baseUrl;
    var imgRxn = getImageFromSdf(sdf);
    var mols = $.parseJSON(imgRxn);

    linksContainer.append("<div id='list" + nameList + "'> </div>");
    $("#list" + nameList).append('<h2>List: ' + nameList + '<h2>');
    $.each(mols, function (index, rxn) {
        baseUrl = 'data:image/x-png;base64,' + rxn.MOL;
        $('<a/>')
            .append($('<img>').prop('src', baseUrl))
            .prop('href', baseUrl)
            .prop('title', "")
            .attr('data-dialog', '')
            .appendTo($("#list" + nameList));
    });
    initializeSlider();
}


function initializeSlider() {
    // Initialize the theme switcher:
    $('#theme-switcher').change(function () {
        var theme = $('#theme');
        theme.prop(
            'href',
            theme.prop('href').replace(
                /[\w\-]+\/jquery-ui.css/,
                $(this).val() + '/jquery-ui.css'
            )
        );
    });

    // Initialize the effect switcher:
    $('#effect-switcher').change(function () {
        var value = $(this).val();
        $('#blueimp-gallery-dialog').data({
            show: value,
            hide: value
        });
    });

    // Initialize the slideshow button:
    $('#slideshow-button')
        .button({ icons: { primary: 'ui-icon-image' } })
        .on('click', function () {
            $('#blueimp-gallery-dialog .blueimp-gallery')
                .data('startSlideshow', true);
            $('#links').children().first().click();
        });
}

function Enumeration() { //arrReactive, rxnQ vzr glob def in viewmol.js
//    var server = window.location.protocol + "//" + window.location.host;
    //var dataX = "{'A':'" + A + "','B':'" + B + "','rxnQ':'" + rxnQ + "'}";
    arrReactive.length = 0;
    for (prop in objReactive) {
        if (objReactive.hasOwnProperty(prop)) {
            arrReactive.push(objReactive[prop]);
        }
    }
    //return;
    var dataX = JSON.stringify({ 'list': arrReactive , 'rxnQ': rxnQ });

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/Enumeration",
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
//    var server = window.location.protocol + "//" + window.location.host;
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

function drawReaction() {
    $("#dialog-Ketcher").dialog("open");
    $("#dialog-Ketcher").dialog({ title: "Draw Reaction" });
}

function loadReactive() {
    $("#dialog-Reactive").dialog("open");
    $("#dialog-Reactive").dialog({ title: "Add Reactive" });
}

function saveReactEnum(expId) {
    var tmp = expId.split("-");
    if (tmp[0].length > 0 & tmp[0].length >0) {

    }
    else {
        alert("Please insert a correct experiment number");
    }
    var expNew = new Experiment(tmp[0], tmp[1]);
    if (!expNew.checkUser()) {
        return;
    }
    //if (expNew.GeneralDataReaction != "") {
    //    alert('Experiment already exists');
    //    return;
    //}

    var ketcher = getKetcher();

    var rxn = ketcher.getMolfile();

    expNew.Rxn = rxn;

    expNew.isEnumerated = true;

    if (rxn.length < 110) {

        //$("#reaction").hide();
        //$("#ketcherContainer").show();
        //var ketcher = getKetcher();
        //alert("Please edit the reaction before to save it");
    }
    var enumRea = [];
    var count = 0;
    $.each(reactionsEnumerated, function (index, rxn) {
        count++;
        var i = { 'Image': '' };
        var r = { 'RXN': rxn[1].RXN };
        var n = { 'EnumNumber': count };
        var En = [];
        En.push(i);
        En.push(r);
        En.push(n);
        enumRea.push(En);
    });
    expNew.Enumerated = enumRea;

    var expGen = new ExpGen();
    expGen.SUBJECT = "";
    expGen.TH = "";
    expGen.PROJECT_CODE = "";
    expGen.BATCH_CREATOR = "";
    expGen.NOTEBOOK = tmp[0];
    expGen.EXPERIMENT = tmp[1];
    expGen.CREATION_DATE = "";
    expGen.CONTINUED_FROM_RXN = "";
    expGen.CONTINUED_TO_RXN = "";
    expGen.PROJECT_ALIAS = "";
    expGen.BATCH_OWNER = "";
    expGen.LITERATURE_REF = "";
    expGen.OWNER_USERNAME = $.session.get("username").toUpperCase();

    expNew.setGenData(expGen);

    expNew.insertEnumeratedReaction();
    $("#tabs").before("<div id='tmp1'> </div>");
    for (var i = 1; i < $('#tabs-3 .ui-tabs-panel').length+1; i++) {
        expNew.Reagents = $("#myReactant" + i).jqGrid('getGridParam', 'data');
        expNew.Products = $("#myProducts" + i).jqGrid('getGridParam', 'data');
        $.each(expNew.Products, function (index, r) {
            r["REACTION_NUMBER"] = i.toString();
        });
        $.each(expNew.Reagents, function (index, p) {
            p["REACTION_NUMBER"] = i.toString();
        });
        $("#tmp1").html("<h2> Saving Reaction " + i + "</h2>")
        expNew.insertEnumeratedBatches();
    }
    $("#tmp1").remove();
}

function viewDecomp() {
    var data = getDecomp();
    cgDecomp($.parseJSON(data));
}

function removeList(list) {
    if (list=="all") {        
        $("#reactives").html("");
        for (prop in objReactive) { if (objReactive.hasOwnProperty(prop)) { delete objReactive[prop]; } }
    }
    else {
        $("#list" + list).html("");
        delete objReactive[list];
    }
}