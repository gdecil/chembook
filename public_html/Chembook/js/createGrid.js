var getCellValueSelected = function (grid, columnName) {
    var rowId = jQuery(grid).jqGrid('getGridParam', 'selrow');
    return jQuery(grid).getRowData(rowId)[columnName];
};

var getRowSelected = function (grid) {
    var rowId = jQuery(grid).jqGrid('getGridParam', 'selrow');
    return jQuery(grid).getRowData(rowId);
};

function getCellValueFromColumn(grid, columnSearch, value, columnGet) {
    var lista = jQuery(grid).getDataIDs();
    var list = [];
    var found = false;

    for (i = 0; i < lista.length; i++) {
        var cellV = $(grid).jqGrid('getCell', lista[i], columnSearch);
        if (cellV == value) {
            return jQuery(grid).getRowData(lista[i])[columnGet];
        }
    }
}

function getGridData(grid, columnSearch, value, columnGet) {
    var lista = jQuery(grid).getDataIDs();
    var list = [];
    var found = false;

    for (i = 0; i < lista.length; i++) {
        var cellV = $(grid).jqGrid('getCell', lista[i], columnSearch);
        if (cellV == value) {
            return jQuery(grid).getRowData(lista[i])[columnGet];
        }
    }
}

function cgAttach(mydata) {
    if (mydata==null) {
        return;
    }
    var grid = $("#myAttach");
//    grid.jqGrid('GridUnload');

    jQuery(grid).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['ID', 'PAGE_KEY', 'NAME', 'DESCRIPTION', 'FILE_NAME'],
        colModel: [
            { name: 'ATTACHEMENT_KEY', index: 'ATTACHEMENT_KEY', width: 60, hidden: true, key: true },
            { name: 'PAGE_KEY', index: 'PAGE_KEY', width: 60, hidden: true },
            { name: 'DOCUMENT_NAME', index: 'DOCUMENT_NAME', width: 150 },
            { name: 'DOCUMENT_DESCRIPTION', index: 'DOCUMENT_DESCRIPTION', width: 200 },
            { name: 'ORIGINAL_FILE_NAME', index: 'ORIGINAL_FILE_NAME', width: 60, hidden: true }
        ],
        caption: "Attachments",
        pager: '#attachPager',
        rowNum: 5,
        viewrecords: true,
        onSelectRow: function (id) {
            var rowData= jQuery(grid).getRowData(id);
            viewAttach(rowData);
        },
        gridview: true 
    });
    jQuery(grid).jqGrid('navGrid', '#attachPager', { add: false, edit: false, del: false, search: false, view: true });

};

function cgDecomp(mydata) {
    jQuery.event.special.click = {
        setup: function () {
            if (jQuery(this).hasClass("ui-search")) {
                jQuery(this).bind("click", jQuery.event.special.click.handler);
            }
            return false;
        },
        teardown: function () {
            jQuery(this).unbind("click", jQuery.event.special.click.handler);
            return false;
        },
        handler: function (event) {
            jQuery(".ui-searchFilter td.ops select").attr("name", "op");
        }
    };


    var grid = $("#myGrid");
    grid.jqGrid('GridUnload');

    jQuery("#myGrid").jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['STRUCTURE', 'STRUCTURE_IMAGE', 'R1', 'RS1', 'R1 img', 'R2', 'RS2', 'R2 img', ],
        colModel: [
            { name: 'STRUCTURE', index: 'STRUCTURE', hidden: true },
            { name: 'STRUCTURE_IMAGE', index: 'STRUCTURE_IMAGE', width: 60, align: "center", editable: true, formatter: imageFormat, unformat: imageUnFormat },
            { name: 'R1', index: 'R1', hidden: true },
            { name: 'RS1', index: 'RS1', width: 20},
            { name: 'R_IMAGE1', index: 'R_IMAGE1', width: 60, align: "center", editable: true, formatter: imageFormat, unformat: imageUnFormat },
            { name: 'R2', index: 'R2', hidden: true },
            { name: 'RS2', index: 'RS2', width: 20 },
            { name: 'R_IMAGE2', index: 'R_IMAGE2', width: 60, align: "center", editable: true, formatter: imageFormat, unformat: imageUnFormat }
        ],
        caption: "RXNID",
        pager: '#gridpager',
        rowNum: 5,
        viewrecords: true,
        postData: {
            filters: '{"groupOp":"AND","rules":[{"field":"RS1","op":"eq","data":""}]}'
        },
        onSelectRow: function (id) {
        },
        gridview: true // !!! improve the performance
    });
    jQuery("#myGrid").jqGrid('navGrid', '#gridpager', { add: false, edit: false, del: false, search: true, view: true },{}, {}, {}, { multipleSearch: true });    

};

function imageFormat(cellvalue, options, rowObject) {
    return '<img src="data:image/x-png;base64,' + cellvalue + '" />';
}
function imageUnFormat(cellvalue, options, cell) {
    return $('img', cell).attr('src');
}

function cgReagents(mydata) {
    if (mydata == null) {
        return;
    }

    var grid = $("#myReactant");
//    grid.jqGrid('GridUnload');

    jQuery("#myReactant").jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['Batch Name', 'Chemical Name', 'MolWeight', 'MolFormula', 'Rxn Role', 'Mol', 'Mol Unit', 'Purity', 'Purity Unit', 'Volume', 'Vol Unit', 'Molarity', 'Molarity Unit', 'Density', 'Density Unit', 'Weight', 'Weigth Unit', 'CAS Number', 'HazardComment'],
        colModel: [
            { name: 'BATCH_NUMBER', index: 'BATCH_NUMBER', width: 120 },
            { name: 'CHEMICAL_NAME', index: 'CHEMICAL_NAME', width: 120 },
            { name: 'BATCH_MW_VALUE', index: 'BATCH_MW_VALUE', width: 60 },
            { name: 'MOLECULAR_FORMULA', index: 'MOLECULAR_FORMULA', width: 100 },
            { name: 'BATCH_TYPE', index: 'BATCH_TYPE', width: 60 },
            { name: 'MOLE_VALUE', index: 'MOLE_VALUE', width: 60 },
            { name: 'MOLE_UNIT_CODE', index: 'MOLE_UNIT_CODE', width: 60 },
            { name: 'PURITY_VALUE', index: 'PURITY_VALUE', width: 60 },
            { name: 'PURITY_UNIT_CODE', index: 'PURITY_UNIT_CODE', width: 60 },
            { name: 'VOLUME_VALUE', index: 'VOLUME_VALUE', width: 60 },
            { name: 'VOLUME_UNIT_CODE', index: 'VOLUME_UNIT_CODE', width: 60 },
            { name: 'MOLARITY_VALUE', index: 'MOLARITY_VALUE', width: 60 },
            { name: 'MOLARITY_UNIT_CODE', index: 'MOLARITY_UNIT_CODE', width: 60 },
            { name: 'DENSITY_VALUE', index: 'DENSITY_VALUE', width: 60 },
            { name: 'DENSITY_UNIT_CODE', index: 'DENSITY_UNIT_CODE', width: 60 },
            { name: 'WEIGHT_VALUE', index: 'WEIGHT_VALUE', width: 60 },
            { name: 'WEIGHT_UNIT_CODE', index: 'WEIGHT_UNIT_CODE', width: 60 },
            { name: 'CAS_NUMBER', index: 'CAS_NUMBER', width: 60 },
            { name: 'USER_HAZARD_COMMENTS', index: 'USER_HAZARD_COMMENTS', width: 160 }
        ],
        caption: "Reactants",
        pager: '#reactantspager',
        rowNum: 5,
        viewrecords: true,
        onSelectRow: function (id) {
        },
        gridview: true // !!! improve the performance
    });
    jQuery("#myReactant").jqGrid('navGrid', '#reactantspager', { add: false, edit: false, del: false, search: false, view: true });

};

function cgProducts(mydata) {
    if (mydata == null) {
        return;
    }

    var grid = $("#myProducts");
    //grid.jqGrid('GridUnload');

    jQuery("#myProducts").jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['Batch Name', 'Chemical Name', 'MolWeight', 'MolFormula', 'Rxn Role', 'Mol', 'Mol Unit', 'Purity', 'Purity Unit', 'Volume', 'Vol Unit', 'Molarity','Molarity Unit','Density','Density Unit','Weight', 'Weigth Unit', 'CAS Number', 'HazardComment'],
        colModel: [
            { name: 'BATCH_NUMBER', index: 'BATCH_NUMBER', width: 120 },
            { name: 'CHEMICAL_NAME', index: 'CHEMICAL_NAME', width: 120 },
            { name: 'BATCH_MW_VALUE', index: 'BATCH_MW_VALUE', width: 60},
            { name: 'MOLECULAR_FORMULA', index: 'MOLECULAR_FORMULA', width: 100},
            { name: 'BATCH_TYPE', index: 'BATCH_TYPE', width: 60},
            { name: 'MOLE_VALUE', index: 'MOLE_VALUE', width: 60},
            { name: 'MOLE_UNIT_CODE', index: 'MOLE_UNIT_CODE', width: 60},
            { name: 'PURITY_VALUE', index: 'PURITY_VALUE', width: 60},
            { name: 'PURITY_UNIT_CODE', index: 'PURITY_UNIT_CODE', width: 60 },
            { name: 'VOLUME_VALUE', index: 'VOLUME_VALUE', width: 60 },
            { name: 'VOLUME_UNIT_CODE', index: 'VOLUME_UNIT_CODE', width: 60},
            { name: 'MOLARITY_VALUE', index: 'MOLARITY_VALUE', width: 60 },
            { name: 'MOLARITY_UNIT_CODE', index: 'MOLARITY_UNIT_CODE', width: 60 },
            { name: 'DENSITY_VALUE', index: 'DENSITY_VALUE', width: 60 },
            { name: 'DENSITY_UNIT_CODE', index: 'DENSITY_UNIT_CODE', width: 60 },
            { name: 'WEIGHT_VALUE', index: 'WEIGHT_VALUE', width: 60 },
            { name: 'WEIGHT_UNIT_CODE', index: 'WEIGHT_UNIT_CODE', width: 60},
            { name: 'CAS_NUMBER', index: 'CAS_NUMBER', width: 60},
            { name: 'USER_HAZARD_COMMENTS', index: 'USER_HAZARD_COMMENTS', width: 160 }
        ],
        caption: "Products",
        pager: '#Productspager',
        rowNum: 5,
        viewrecords: true,
        onSelectRow: function (id) {
        },
        gridview: true // !!! improve the performance
    });
    jQuery("#myProducts").jqGrid('navGrid', '#Productspager', { add: false, edit: false, del: false, search: false, view: true });

};

function cgMolecules(gridId, mydata) {
//  var mydata = 
//    [
//      {"name" : "smile", "info" : "hdhdhdh"},
//      {"name" : "inchi", "info" : "isisisisi"}
//    ];
  
   var grid = $(gridId);
   grid.jqGrid('GridUnload');
        
    jQuery(gridId).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['Name', 'Info'],
        colModel: [
            {name: 'name', index: 'name', width: 20},
            {name: 'info', index: 'info', width: 100}
        ],
        caption: "MolInfo",
        pager : gridId + 'pager',
        rowNum: 20,
        viewrecords : true,
        onSelectRow: function(id){ 
            currentName = getCellValueSelected(gridId, 'name')
            currentInfo = getCellValueSelected(gridId, 'info')
            if (currentName=="inchi"){
              getChemspider(currentInfo)
            }
            if (currentName=="Formula"){
              var url= serverWeb + "/chembookAng/index.html#/graph/ccn1"
              window.open(url, '_self');  
            }
            if (currentName=="CAS"){
              getNIST(currentInfo)
              getTOXNET(currentInfo)
              get3D(currentInfo)
              getGusar(currentInfo)
              getNCI(currentInfo)
              getChemIdPlus(currentInfo)
            }
         },
        gridview: true // !!! improve the performance
    });
        jQuery(gridId).jqGrid('navGrid', gridId + 'pager',{add: false, edit: false, del: false, search: false, view: true});

};

function cgMoleculesMar(gridId, mydata) {
   var grid = $(gridId);
   grid.jqGrid('GridUnload');
        
    jQuery(gridId).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['USERNAME', 'BATCH', 'CORPID', 'SUBMISSION_DATE', 'STRID'],
        colModel: [
            {name: 'username', index: 'username', width: 60},
            {name: 'batch', index: 'batch', width: 60},
            {name: 'corp_id', index: 'corp_id', width: 60},
            { name: 'submission_date', index: 'submission_date', width: 60 },
            {name: 'str_id', index: 'str_id', width: 60, hidden:true, key:true}
        ],
        caption: "STRID",
        pager : gridId + 'pager',
        rowNum: 5,
        viewrecords : true,
        onSelectRow: function(id){ 
            if(event.ctrlKey)
            {            
                batch = getCellValueSelected(gridId, 'batch')
                getReactions("batch=" + batch ,"", "","") 
            }
            currentStrid = id
            appendMolecule( $('#containerReaction'), id);
         },
        gridview: true // !!! improve the performance
    });
        jQuery(gridId).jqGrid('navGrid', gridId + 'pager',{add: false, edit: false, del: false, search: false, view: true});

};

function cgReactions(gridId, mydata) {
   var grid = $(gridId);
   grid.jqGrid('GridUnload');
        
    jQuery(gridId).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['USERNAME', 'NOTEBOOK', 'PAGE', 'CREATION_DATE m/d/Y', 'SUBJECT', 'ID'],
        colModel: [
            {name: 'username', index: 'username', width: 60},
            {name: 'notebook', index: 'notebook', width: 60},
            {name: 'page', index: 'page', width: 60},
            { name: 'creation_date', index: 'creation_date', width: 60, formatter: 'date', formatoptions: { newformat: 'm/d/Y' } },
            {name: 'subject', index: 'subject', width: 160},
            {name: 'rxn_scheme_key', index: 'rxn_scheme_key', width: 60, hidden:true, key:true}
        ],
        caption: "RXNID",
        pager : gridId + 'pager',
        rowNum: 5,
        viewrecords : true,
        onSelectRow: function(id){ 
            currentNB = getCellValueSelected(gridId, 'notebook')
            currentPage = getCellValueSelected(gridId, 'page')
            exp = new Experiment(currentNB,currentPage);
            appendReaction( $('#containerReaction'), id);
         },
        gridview: true // !!! improve the performance
    });
        jQuery(gridId).jqGrid('navGrid', gridId + 'pager',{add: false, edit: false, del: false, search: false, view: true});

};

function cgReactionsData(mydata) {
    var grid = $("#myGrid");
    grid.jqGrid('GridUnload');

    jQuery("#myGrid").jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['ID', 'FORMULATION_ID', 'DATABASE', 'NAME', 'USERNAME', 'DATE', 'LOCATION', 'FORMULATION', 'DENSITY'],
        colModel: [
            { name: 'ID', index: 'ID', width: 60, hidden: false, key: true },
            { name: 'FORMULATION_ID', index: 'FORMULATION_ID', width: 60, hidden: true },
            { name: 'DATABASE', index: 'DATABASE', width: 60 },
            { name: 'NAME', index: 'NAME', width: 150 },
            { name: 'RESP', index: 'RESP', width: 120 },
            { name: 'SUBMISSION_DATE', index: 'SUBMISSION_DATE', width: 160, formatter: 'date', formatoptions: { newformat: 'm/d/Y' }, hidden: true },
            { name: 'LOCATION', index: 'LOCATION', width: 60, hidden: true },
            { name: 'FORMULATION', index: 'FORMULATION', width: 200 },
            { name: 'DENSITY', index: 'DENSITY', width: 50 }
        ],
        caption: "All Databases Info",
        pager: '#gridpager',
        rowNum: 5,
        rowList: [5, 10, 20, 50],
        viewrecords: true,
        onSelectRow: function (id) {
            //            getRXN(id);
        },
        gridComplete: function () {

            $('.jqgrow').click(function(e) {
                var rowId = $(this).attr('ID');
                var Id = $("#myGrid").jqGrid('getCell', rowId, 'ID');
                var db = $("#myGrid").jqGrid('getCell', rowId, 'DATABASE');
                //$("#dialog-View").dialog("open");
                //$("#dialog-View").dialog({ title: db });

                $('#viewMol').html("");
                var grid = $("#myGridForm");
                grid.jqGrid('GridUnload');

                if (db == "Chemtools") {
                    $("#selectedMol").remove();
                    var mol = $("#myGrid").jqGrid('getCell', rowId, 'NAME');
                    appendMolecule('#viewMol', mol, db,'Batch');
                } 
                else if (db == "Bottles") {
                    var mol = Id;
                    appendMolecule('#viewMol', mol, 'bottle', 'StrId');

                    $("#selectedMol").remove();
                    var name = $("#myGrid").jqGrid('getCell', rowId, 'NAME');
                    var form = $("#myGrid").jqGrid('getCell', rowId, 'FORMULATION');
                    var formId = $("#myGrid").jqGrid('getCell', rowId, 'FORMULATION_ID');
                    $("[aria-describedby='dialog-Find'] .ui-dialog-buttonpane").before("<div id='selectedMol'><p>Selected: " + name + " Formulation:" + form + "</p></div>");
                    var data = getFormulationData(formId)
                    
                    cgFormulationData($.parseJSON(data));

                }
                else {
                    $("#selectedMol").remove();
                    $('#viewMol').html("")
                    appendReaction('#viewMol', Id);
                }
                var NAME = $("#myGrid").jqGrid('getCell', rowId, 'NAME');
                $('#viewMol').append(NAME);

                //alert(db + ' You rolled over ' + rowId);
            });
        },
        //gridComplete: function() { 
        //    $('.jqgrow').mouseover(function(e) {
        //        var selectedRows = $("#searchGrid").jqGrid('getGridParam', 'selarrrow');
        //        var selectedIds = [];
        //        for(var i in selectedRows){
        //            selectedIds.push($("#searchGrid").jqGrid('getCell', selectedRows[i], 'trackingId'));
        //        }                        
        //    }
        //); 
        //},
        gridview: true // !!! improve the performance
    });
    jQuery("#myGrid").jqGrid('navGrid', '#gridpager', { add: false, edit: false, del: false, search: false, view: true });

};
/**
 * Comment
 */
function cgReactionsClear() {
    var grid = $("#myGrid");
   grid.jqGrid('GridUnload');
}

function cgFormulationData(mydata) {
    var grid = $("#myGridForm");

    jQuery(grid).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['FORMULATION_ID', 'BOTTLE_ID', 'RISK_CODES', 'RISK_SYMBOLS', 'SAFETY_CODES', 'DENSITY', 'PURITY', 'CURRENT_OWNER', 'STORAGE_LOCATION', 'STORAGE_SUBLOCATION', 'FORMULATION_NAME', 'LAST_WEIGH', 'UNIT'],
        colModel: [
            { name: 'FORMULATION_ID', index: 'FORMULATION_ID', width: 60, hidden: true },
            { name: 'BOTTLE_ID', index: 'BOTTLE_ID', width: 60, key: true },
            { name: 'RISK_CODES', index: 'RISK_CODES', width: 150 },
            { name: 'RISK_SYMBOLS', index: 'RISK_SYMBOLS', width: 120 },
            { name: 'SAFETY_CODES', index: 'SAFETY_CODES', width: 160 },
            { name: 'DENSITY', index: 'DENSITY', width: 60 },
            { name: 'PURITY', index: 'PURITY', width: 60 },
            { name: 'CURRENT_OWNER', index: 'CURRENT_OWNER', width: 200 },
            { name: 'STORAGE_LOCATION', index: 'STORAGE_LOCATION', width: 50 },
            { name: 'STORAGE_SUBLOCATION', index: 'STORAGE_SUBLOCATION', width: 200 },
            { name: 'FORMULATION_NAME', index: 'FORMULATION_NAME', width: 200 },
            { name: 'LAST_WEIGH', index: 'LAST_WEIGH', width: 200 },
            { name: 'UNIT', index: 'UNIT', width: 50 }
        ],
        caption: "All Formulations Info",
        pager: '#gridpagerform',
        rowNum: 5,
        rowList: [5, 10, 20, 50],
        viewrecords: true,
        onSelectRow: function (id) {
        },
        gridComplete: function () {
        },
        gridview: true 
    });
    jQuery("#myGridForm").jqGrid('navGrid', '#gridpagerform', { add: false, edit: false, del: false, search: false, view: true });

};

function cgFormulations(mydata) {
    var grid = $("#myGridFormFind");

    jQuery(grid).jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['FORMULATION_ID', '  STRUCTURE_ID', 'RISK_CODES', 'RISK_SYMBOLS', 'SAFETY_CODES', 'DENSITY', 'PURITY', 'FORMULATION_NAME', 'SIGMA', 'CAS-NUMBER'],
        colModel: [
            { name: 'FORMULATION_ID', index: 'FORMULATION_ID', width: 60, hidden: true, key: true },
            { name: 'STRUCTURE_ID', index: 'STRUCTURE_ID', width: 60 },
            { name: 'RISK_CODES', index: 'RISK_CODES', width: 150 },
            { name: 'RISK_SYMBOLS', index: 'RISK_SYMBOLS', width: 120 },
            { name: 'SAFETY_CODES', index: 'SAFETY_CODES', width: 160 },
            { name: 'DENSITY', index: 'DENSITY', width: 60 },
            { name: 'PURITY', index: 'PURITY', width: 60 },
            { name: 'FORMULATION_NAME', index: 'FORMULATION_NAME', width: 200 },
            { name: 'SIGMA', index: 'SIGMA', width: 50 },
            { name: 'CAS_NUMBER', index: 'CAS_NUMBER', width: 50 }
        ],
        caption: "All Formulations Info",
        pager: '#gridpagerformfind',
        rowNum: 5,
        rowList: [5, 10, 20, 50],
        viewrecords: true,
        onSelectRow: function (id) {
        },
        gridComplete: function () {
        },
        gridview: true
    });
    jQuery("#myGridFormFind").jqGrid('navGrid', '#gridpagerformfind', { add: false, edit: false, del: false, search: false, view: true });

};
function cgTest() {
    var mydata = [
        {id: 10, name: "Oleg"},
        {id: 20, name: "Mike"}
    ];
    
    jQuery("#myGrid").jqGrid({
        datatype: "local",
        data: mydata,
        height: 'auto',
        autowidth: true,
        colNames: ['ID', 'Name'],
        colModel: [
            {name: 'id', index: 'id', width: 60, sorttype: "int", key: true},
            {name: 'name', index:'name', width: 90}
        ],
        caption: "Test",
        pager : '#gridpager',
        rowNum: 3,
        rowList:[1,2,3],
        viewrecords : true,
        pgbuttons: true,
        gridview: true // !!! improve the performance
    }).navGrid('#gridpager',{add: false, edit: false, del: false, search: false, view: true});
    
//    jQuery("#myGrid").jqGrid('navGrid','#gridpager',{add: false, edit: false, del: false, search: false, view: true});
};

function createLocalGrid() {
    var mydata = 
    [
        ["1", "1", "true", "12x8"],
        ["2", "5", "false", "8x6"]
    ];

    var grid = $("#myGrid");
//    grid.jqGrid('GridUnload');

    grid.jqGrid({
        datatype: "local",
        data: mydata,
        colNames: ['id', 'category', '', 'type'],
        colModel: [
            { name: 'id', index: 'id', width: 65, sorttype: 'int', hidden: true },
            { name: 'category', index: 'category', width: 120, align: 'center' },
            { name: 'Select', index: 'Select', editable: true, edittype: 'checkbox', editoptions: { value: "True:False" },
                formatter: "checkbox", formatoptions: { disabled: false }, width: 90
            },
            { name: 'Type', index: 'Type', editable: true, width: 70, align: 'right' }
        ],
        sortname: 'invdate',
        viewrecords: true,
        rownumbers: true,
        sortorder: "desc",
        caption: 'bob',
        height: "100%",
        rowList:[1,2,3],
        localReader: {
            repeatitems: true,
            cell: "",
            id: 0
        }
    });
}

function createGridHierarchy() {
    var mydata;
    jQuery("#myGrid").jqGrid({
        datatype: 'local',
        data: mydata,
        height: 190,
        colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
        colModel: [
            { name: 'id', index: 'id', width: 55 },
            { name: 'invdate', index: 'invdate', width: 90 },
            { name: 'name', index: 'name', width: 100 },
            { name: 'amount', index: 'amount', width: 80, align: "right" },
            { name: 'tax', index: 'tax', width: 80, align: "right" },
            { name: 'total', index: 'total', width: 80, align: "right" },
            { name: 'note', index: 'note', width: 150, sortable: false }
        ],
        rowNum: 8,
        rowList: [8, 10, 20, 30],
        pager: '#psg3',
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        multiselect: false,
        subGrid: true,
        caption: "Custom Icons in Subgrid",
        // define the icons in subgrid
        subGridOptions: {
            "plusicon": "ui-icon-triangle-1-e",
            "minusicon": "ui-icon-triangle-1-s",
            "openicon": "ui-icon-arrowreturn-1-e",
            // load the subgrid data only once
            // and the just show/hide
            "reloadOnExpand": false,
            // select the row when the expand column is clicked
            "selectOnExpand": true
        },
        subGridRowExpanded: function (subgrid_id, row_id) {
            var subgrid_table_id, pager_id;
            subgrid_table_id = subgrid_id + "_t";
            pager_id = "p_" + subgrid_table_id;
            $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
            jQuery("#" + subgrid_table_id).jqGrid({
                url: "subgrid.php?q=2&id=" + row_id,
                datatype: "xml",
                colNames: ['No', 'Item', 'Qty', 'Unit', 'Line Total'],
                colModel: [
                    { name: "num", index: "num", width: 80, key: true },
                    { name: "item", index: "item", width: 130 },
                    { name: "qty", index: "qty", width: 70, align: "right" },
                    { name: "unit", index: "unit", width: 70, align: "right" },
                    { name: "total", index: "total", width: 70, align: "right", sortable: false }
                ],
                rowNum: 20,
                pager: pager_id,
                sortname: 'num',
                sortorder: "asc",
                height: '100%'
            });
            jQuery("#" + subgrid_table_id).jqGrid('navGrid', "#" + pager_id, { edit: false, add: false, del: false })
        }
    });
    jQuery("#sg3").jqGrid('navGrid', '#psg3', { add: false, edit: false, del: false });
}

function cgProductsReagentsSave(mydata, gridn, pager, caption, mole, type) {
    
    var lastSel,
        grid = $(gridn),
        onclickSubmitLocal = function (options, postdata) {
            if (expCurrent != undefined) {
                expCurrent.isStoichChanged = true;
            }
            postdata.BATCH_NUMBER = postdata.BATCH_NUMBER.toUpperCase();
            $('#BATCH_NUMBER').val(postdata.BATCH_NUMBER)
            var batKey = postdata.BATCH_KEY
            var oldVal;
            if (postdata['myProducts_id'] != undefined) {
                oldVal = jQuery(grid).getRowData(postdata['myProducts_id'])['BATCH_NUMBER']
            }
            if (postdata['myReactant_id'] != undefined) {
                oldVal = jQuery(grid).getRowData(postdata['myReactant_id'])['BATCH_NUMBER']
            }
            if (oldVal != postdata.BATCH_NUMBER) {
                if (checkBatchExistChemtools(postdata.BATCH_NUMBER) == 'Y') {
                    alert('The batch ' + postdata.BATCH_NUMBER + ' already exists in Chemtools')
                    return
                }
                if (checkBatchExistChemeln(postdata.BATCH_NUMBER) == 'Y') {
                    alert('The batch ' + postdata.BATCH_NUMBER + ' already exists in ChemEln')
                    return
                }
            }
            if (postdata.DENSITY_VALUE == "") {
                if (postdata.PURITY_VALUE == "") {                    
                    postdata.THEO_WT_VALUE = (postdata.MOLE_VALUE * postdata.BATCH_MW_VALUE * 100 / (1 * 100)).toFixed(3).toString()
                    $('#THEO_WT_VALUE').val(postdata.THEO_WT_VALUE)
                }
                else {
                    postdata.THEO_WT_VALUE = (postdata.MOLE_VALUE * postdata.BATCH_MW_VALUE * 100 / (1 * postdata.PURITY_VALUE)).toFixed(3).toString()
                    $('#THEO_WT_VALUE').val(postdata.THEO_WT_VALUE)
                }
                postdata.VOLUME_VALUE = "";
                $('#VOLUME_VALUE').val(postdata.VOLUME_VALUE) 
            }
            else {
                if (postdata.PURITY_VALUE == "") {
                    postdata.THEO_WT_VALUE = (postdata.MOLE_VALUE * postdata.BATCH_MW_VALUE * 100 / (postdata.DENSITY_VALUE * 100)).toFixed(3).toString()
                    $('#THEO_WT_VALUE').val(postdata.THEO_WT_VALUE)
                }
                else {
                    postdata.THEO_WT_VALUE = (postdata.MOLE_VALUE * postdata.BATCH_MW_VALUE * 100 / (postdata.DENSITY_VALUE * postdata.PURITY_VALUE)).toFixed(3).toString()
                    $('#THEO_WT_VALUE').val(postdata.THEO_WT_VALUE)
                }
                postdata.VOLUME_VALUE = (postdata.THEO_WT_VALUE / postdata.DENSITY_VALUE).toFixed(3).toString();
                $('#VOLUME_VALUE').val(postdata.VOLUME_VALUE)
            }
            if (postdata.WEIGHT_VALUE != "" & parseFloat(postdata.THEO_WT_VALUE) > 0) {
                postdata.THEO_YLD_PCNT_VALUE = (postdata.WEIGHT_VALUE / postdata.THEO_WT_VALUE * 100).toFixed(1)
                $('#THEO_YLD_PCNT_VALUE').val(postdata.THEO_YLD_PCNT_VALUE)
            }

            if (parseFloat(postdata.THEO_WT_VALUE) ==0) {
                postdata.THEO_YLD_PCNT_VALUE = 0;
                $('#THEO_YLD_PCNT_VALUE').val(postdata.THEO_YLD_PCNT_VALUE)
            }

            var grid_p = grid[0].p,
                idname = grid_p.prmNames.id,
                grid_id = grid[0].id,
                id_in_postdata = grid_id + "_id",
                rowid = postdata[id_in_postdata],
                addMode = rowid === "_empty",
                oldValueOfSortColumn;

            // postdata has row id property with another name. we fix it:
            if (addMode) {
                // generate new id
                var new_id = grid_p.records + 1;
                while ($("#" + new_id).length !== 0) {
                    new_id++;
                }
                //gpdc
                rowid = new_id;
                postdata[idname] = String(new_id);
            } else if (typeof (postdata[idname]) === "undefined") {
                // set id property only if the property not exist
                postdata[idname] = rowid;
            }
            delete postdata[id_in_postdata];

            // prepare postdata for tree grid
            if (grid_p.treeGrid === true) {
                if (addMode) {
                    var tr_par_id = grid_p.treeGridModel === 'adjacency' ? grid_p.treeReader.parent_id_field : 'parent_id';
                    postdata[tr_par_id] = grid_p.selrow;
                }

                $.each(grid_p.treeReader, function (i) {
                    if (postdata.hasOwnProperty(this)) {
                        delete postdata[this];
                    }
                });
            }

            // decode data if there encoded with autoencode
            if (grid_p.autoencode) {
                $.each(postdata, function (n, v) {
                    postdata[n] = $.jgrid.htmlDecode(v); // TODO: some columns could be skipped
                });
            }

            // save old value from the sorted column
            oldValueOfSortColumn = grid_p.sortname === "" ? undefined : grid.jqGrid('getCell', rowid, grid_p.sortname);

            // save the data in the grid
            if (grid_p.treeGrid === true) {
                if (addMode) {
                    grid.jqGrid("addChildNode", rowid, grid_p.selrow, postdata);
                } else {
                    grid.jqGrid("setTreeRow", rowid, postdata);
                }
            } else {
                if (addMode) {
                    grid.jqGrid("addRowData", rowid, postdata, options.addedrow);
                } else {
                    grid.jqGrid("setRowData", rowid, postdata);
                }
            }

            if ((addMode && options.closeAfterAdd) || (!addMode && options.closeAfterEdit)) {
                // close the edit/add dialog
                $.jgrid.hideModal("#editmod" + grid_id,
                                  { gb: "#gbox_" + grid_id, jqm: options.jqModal, onClose: options.onClose });
            }

            //if (postdata[grid_p.sortname] !== oldValueOfSortColumn) {
            //    // if the data are changed in the column by which are currently sorted
            //    // we need resort the grid
            //    setTimeout(function () {
            //        grid.trigger("reloadGrid", [{ current: true }]);
            //    }, 100);
            //}

            // !!! the most important step: skip ajax request to the server
            this.processing = true;
            return {};
        },
        editSettings = {
            //recreateForm:true,
            //jqModal: false,
            //reloadAfterSubmit: true,
            closeOnEscape: true,
            //savekey: [true, 13],
            //closeAfterEdit: true,
            beforeShowForm: function (form) {
                $('#tr_BATCH_MW_VALUE', form).hide();
                $('#tr_BATCH_KEY', form).hide();
            },
            width: 800,
            mtype: 'GET',
            onclickSubmit: onclickSubmitLocal
        },
        addSettings = {
            //recreateForm:true,
            //jqModal: false,
            //reloadAfterSubmit: false,
            //savekey: [true, 13],
            closeOnEscape: true,
            closeAfterAdd: true,
            width: 800,
            mtype: 'GET',
            beforeShowForm: function (form) {
                $('#tr_BATCH_KEY', form).hide();
            },
            onclickSubmit: onclickSubmitLocal
        },
        delSettings = {
            // because I use "local" data I don't want to send the changes to the server
            // so I use "processing:true" setting and delete the row manually in onclickSubmit
            onclickSubmit: function (options, rowid) {
                var grid_id = $.jgrid.jqID(grid[0].id),
                    grid_p = grid[0].p,
                    newPage = grid[0].p.page;

                // delete the row
                grid.delRowData(rowid);
                $.jgrid.hideModal("#delmod" + grid_id,
                                  { gb: "#gbox_" + grid_id, jqm: options.jqModal, onClose: options.onClose });

                if (grid_p.lastpage > 1) {// on the multipage grid reload the grid
                    if (grid_p.reccount === 0 && newPage === grid_p.lastpage) {
                        // if after deliting there are no rows on the current page
                        // which is the last page of the grid
                        newPage--; // go to the previous page
                    }
                    // reload grid to make the row from the next page visable.
                    grid.trigger("reloadGrid", [{ page: newPage }]);
                }

                return true;
            },
            processing: true
        },
        initDateEdit = function (elem) {
            setTimeout(function () {
                $(elem).datepicker({
                    dateFormat: 'dd-M-yy',
                    autoSize: true,
                    showOn: 'button', // it dosn't work in searching dialog
                    changeYear: true,
                    changeMonth: true,
                    showButtonPanel: true,
                    showWeek: true
                });
                //$(elem).focus();
            }, 100);
        },
        initDateSearch = function (elem) {
            setTimeout(function () {
                $(elem).datepicker({
                    dateFormat: 'dd-M-yy',
                    autoSize: true,
                    //showOn: 'button', // it dosn't work in searching dialog
                    changeYear: true,
                    changeMonth: true,
                    showButtonPanel: true,
                    showWeek: true
                });
                //$(elem).focus();
            }, 100);
        };

    grid.jqGrid({
        datatype: 'jsonstring',
        datastr: mydata,
//        datatype: 'local',
//        data: mydata,
        colNames: ['id', '', 'Batch Name', 'Chemical Name', 'MolWeight', 'MolFormula', 'Rxn Role', 'Mol', 'Mol Unit', 'Purity %', 'Purity Unit', 'Volume', 'Vol Unit', 'Molarity', 'Molarity Unit', 'Density g/ml', 'Density Unit', 'Weight', 'Weigth Unit', 'Theo. Weight', 'Theo. W. Unit', 'Yield %', 'CAS Number', 'HazardComment'],
        colModel: [
            { name: 'id', index: 'id', editable: false, edittype: 'text', width: 20, align: "center", hidden: true },
            {
                name: 'BATCH_KEY', index: 'BATCH_KEY', editable: true, edittype: 'text', editoptions: { size: 30 }, align: "center", width: 120,
                formoptions: { rowpos: 12, colpos: 1 }, editrules: { required: false },hidden: true
            },
            {
                name: 'BATCH_NUMBER', index: 'BATCH_NUMBER', editable: true, edittype: 'text', editoptions:{size:30}, align: "center", width: 120,
                formoptions: { rowpos: 1, colpos: 1 }, editrules: { required: false }
            },
            {
                name: 'CHEMICAL_NAME', index: 'CHEMICAL_NAME', editable: true, edittype: 'text', align: "center", width: 120,
                formoptions: { rowpos: 1, colpos: 2 }
            },
            {
                name: 'BATCH_MW_VALUE', index: 'BATCH_MW_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: { decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: '' },
                formoptions: { rowpos: 11, colpos: 1 }
            },
            {
                name: 'MOLECULAR_FORMULA', index: 'MOLECULAR_FORMULA', editable: false, align: "center", width: 100
            },
            {
                name: 'BATCH_TYPE', index: 'BATCH_TYPE', editable: true, edittype: 'select', editoptions: { value: 'REAGENT:REAGENT;SOLVENT:SOLVENT;REACTANT:REACTANT;PRODUCT:PRODUCT' }, align: "center", width: 60,
                formoptions: { rowpos: 2, colpos: 1 }
            },
            {
                name: 'MOLE_VALUE', index: 'MOLE_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: { decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: '' },
                formoptions: { rowpos: 4, colpos: 1 }

            },
            {
                name: 'MOLE_UNIT_CODE', index: 'MOLE_UNIT_CODE', editable: true, edittype: 'select', editoptions: { value: 'mMole:mMole; uMole:uMole' }, align: "center", width: 60,
                formoptions: { rowpos: 4, colpos: 2 }
            },
            {
                name: 'PURITY_VALUE', index: 'PURITY_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 3, colpos: 1 }

            },
            {
                name: 'PURITY_UNIT_CODE', index: 'PURITY_UNIT_CODE', editable: false, edittype: 'select', editoptions: { value: '%:%' }, align: "center", width: 60, hidden: true
            },
            {
                name: 'VOLUME_VALUE', index: 'VOLUME_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 5, colpos: 1 }

            },
            {
                name: 'VOLUME_UNIT_CODE', index: 'VOLUME_UNIT_CODE', editable: true, edittype: 'select', editoptions: { value: 'ml:ml; ul:ul' }, align: "center", width: 60,
                formoptions: { rowpos: 5, colpos: 2 }
            },
            {
                name: 'MOLARITY_VALUE', index: 'MOLARITY_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 6, colpos: 1 }

            },
            {
                name: 'MOLARITY_UNIT_CODE', index: 'MOLARITY_UNIT_CODE', editable: true, edittype: 'select', editoptions: { value: 'mM:mM; uM:uM' }, align: "center", width: 60,
                formoptions: { rowpos: 6, colpos: 2 }
            },
            {
                name: 'DENSITY_VALUE', index: 'DENSITY_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 3, colpos: 2 }

            },
            {
                name: 'DENSITY_UNIT_CODE', index: 'DENSITY_UNIT_CODE', editable: false, edittype: 'select', editoptions: { value: 'g/ml:g/ml; mg/ml:mg/ml' }, align: "center", width: 60, hidden: true
            },
            {
                name: 'WEIGHT_VALUE', index: 'WEIGHT_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 8, colpos: 1 }

            },
            {
                name: 'WEIGHT_UNIT_CODE', index: 'WEIGHT_UNIT_CODE', editable: true, edittype: 'select', editoptions: { value: 'g:g; mg:mg' }, align: "center", width: 60,
                formoptions: { rowpos: 8, colpos: 2 }
            },
            {
                name: 'THEO_WT_VALUE', index: 'THEO_WT_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 3, defaultValue: ''
                },
                formoptions: { rowpos: 9, colpos: 1 }

            },
            {
                name: 'THEO_WT_UNIT_CODE', index: 'THEO_WT_UNIT_CODE', editable: true, edittype: 'select', editoptions: { value: 'g:g; mg:mg' }, align: "center", width: 60,
                formoptions: { rowpos: 9, colpos: 2 }
            },
            {
                name: 'THEO_YLD_PCNT_VALUE', index: 'THEO_YLD_PCNT_VALUE', editable: true, align: "center", width: 60, formatter: 'number',
                formatoptions: {
                    decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 1, defaultValue: ''
                },
                formoptions: { rowpos: 10, colpos: 2 }

            },
            {
                name: 'CAS_NUMBER', index: 'CAS_NUMBER', editable: true, align: "center", width: 60,
                formoptions: { rowpos: 10, colpos: 1 }
            },
            {
                name: 'USER_HAZARD_COMMENTS', index: 'USER_HAZARD_COMMENTS', editable: true, align: "center", width: 160,
                formoptions: { rowpos: 2, colpos: 2 }
            }
        ],
        rowNum: 10,
        rowList: [5, 10, 20],
        pager: pager,
        gridview: true,
        rownumbers: true,
        autoencode: true,
        ignoreCase: true,
        //sortname: 'BATCH_NUMBER',
        viewrecords: true,
        //sortorder: 'desc',
        caption: caption,
        height: '100%',
        editurl: 'clientArray.html',
        jsonReader: {
        	repeatitems: false,
        	id: "0",
        	root: function(obj){
        		return obj;
        	},
        	records: function(obj){
        		return obj.length;
        	},
        	page: function(){
        		return 1;
        	},
        	total: function(){
        		return 1;
        	}
        },
        ondblClickRow: function (rowid, ri, ci) {
            var p = grid[0].p;
            if (p.selrow !== rowid) {
                // prevent the row from be unselected on double-click
                // the implementation is for "multiselect:false" which we use,
                // but one can easy modify the code for "multiselect:true"
                grid.jqGrid('setSelection', rowid);
            }
            grid.jqGrid('editGridRow', rowid, editSettings);
        },
        onSelectRow: function (id) {
            if (id && id !== lastSel) {
                // cancel editing of the previous selected row if it was in editing state.
                // jqGrid hold intern savedRow array inside of jqGrid object,
                // so it is safe to call restoreRow method with any id parameter
                // if jqGrid not in editing state
                if (typeof lastSel !== "undefined") {
                    grid.jqGrid('restoreRow', lastSel);
                }
                lastSel = id;
            }
        }
    }).jqGrid('navGrid', pager, { search: false , refresh : false},
              editSettings,
              addSettings,
              delSettings,
              {
                  multipleSearch: true,
                  overlay: false,
                  onClose: function (form) {
                      // if we close the search dialog during the datapicker are opened
                      // the datepicker will stay opened. To fix this we have to hide
                      // the div used by datepicker
                      $("div#ui-datepicker-div.ui-datepicker").hide();
                  }
              });

}

function calculate(grid, mole, type) {
    if (type=='view') {
        return
    }
    if (mole == undefined | mole == "") {
        mole = 1;
    }

    var lista = jQuery(grid).getDataIDs();
    for (i = 0; i < lista.length; i++) {
        var mw = getCellValue(grid, 'BATCH_MW_VALUE', i);
        //jQuery(grid).jqGrid('setCell', lista[i], 'CAS_NUMBER', 'ugo', null, null, true);

        var rowData = jQuery(grid).getRowData()[i];
        rowData.MOLE_VALUE = mole.toString();
        rowData.DENSITY_UNIT_CODE = "g/ml";
        rowData.PURITY_UNIT_CODE = "%";
        rowData.MOLE_UNIT_CODE = "mMole";
        rowData.WEIGHT_UNIT_CODE = "mg";
        rowData.VOLUME_UNIT_CODE = "ul";

        if (rowData.DENSITY_VALUE == "") {
            if (rowData.PURITY_VALUE == "") {
                rowData.WEIGHT_VALUE = (rowData.MOLE_VALUE * rowData.BATCH_MW_VALUE * 100 / (1 * 100)).toFixed(3).toString()
            }
            else {
                rowData.WEIGHT_VALUE = (rowData.MOLE_VALUE * rowData.BATCH_MW_VALUE * 100 / (1 * rowData.PURITY_VALUE)).toFixed(3).toString()
            }
            rowData.VOLUME_VALUE = "";
        }
        else {
            if (rowData.PURITY_VALUE == "") {
                rowData.WEIGHT_VALUE = (rowData.MOLE_VALUE * rowData.BATCH_MW_VALUE * 100 / (rowData.DENSITY_VALUE * 100)).toFixed(3).toString()
            }
            else {
                rowData.WEIGHT_VALUE = (rowData.MOLE_VALUE * rowData.BATCH_MW_VALUE * 100 / (rowData.DENSITY_VALUE * rowData.PURITY_VALUE)).toFixed(3).toString()
            }
            rowData.VOLUME_VALUE = (rowData.WEIGHT_VALUE / rowData.DENSITY_VALUE).toFixed(3).toString();
        }


        $(grid).jqGrid('setRowData', lista[i], rowData);

        //jQuery(grid).jqGrid('setCell', i, 'WEIGHT_VALUE', mole * mw, null, null, true);
    }
}

var getCellValue = function (grid, columnName, row) {
    var rowId = jQuery(grid).getDataIDs()[row]
    var val = jQuery(grid).getRowData(rowId)[columnName];
    return val;
};
