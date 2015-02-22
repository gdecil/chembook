
function appendMolecule(containerId, batch, db, type) {
    if (batch == undefined) {
        $('#' + containerId).append("<img id='moleculeB' src='" + server + "GetMolecule.ashx?molecule=C1CCCC1' />")  ;        
    }
    else {
        if (db == "bottle") {
            var src = server + '/GetMoleculeP.ashx?batch=' + batch + "&db=" + db + "&type=" + type;
            var img_height = $(containerId).parent().height();
            var img_width = $(containerId).parent().width();
            $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
        }
        else {
            var src = server + '/GetMoleculeP.ashx?batch=' + batch + "&db=" + db + "&type=" + type;
            var img_height = $(containerId).parent().height();
            var img_width = $(containerId).parent().width();
            $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
        }

        //$('#' + containerId).append("<img id='molecule' src=" + src +  " />")  ;        
    }
}

function appendReaction(containerId, reaction) {
    $(containerId).html("");
    if (reaction==null) {        
        return;
    }
    if (reaction == undefined) {
        var src = server + '/GetReaction.ashx';
    }
    else {
        random = Math.ceil(Math.random() * 10000)
        var src = server + '/GetReaction.ashx?idReaction=' + reaction + '&rand=' + random;
    }
    var img_height = $(containerId).parent().height();
    var img_width = $(containerId).parent().width();
    $(containerId).append("<img id='moleculeB' src=" + src + " style='width: " + img_width + "px; height: " + img_height + "px;'/>");
    $(containerId).parent().removeClass("ui-widget-content");
}

function appendRxn(containerId,rxn) {
    var src = server + '/GetRxnImage.ashx?rxn=' + rxn;
    $(containerId).append("<img src=" + src +  "/>")  ;
}

function appendToolbar(page) {
    if (page == "search") {
        toolbarSearch();
        //html = "<li id='tbarToggleNorth' class='first'><span></span>Search SSS</li>" +
        //"<li id='tbarOpenSouth'><span></span>Search Exact</li>" +
        //"<li id='tbarCloseSouth'><span></span>Clear</li>" +
        //"<li id='tbarSearchOpenSelected'><span></span>View Selected</li>"+
        //"<li id='tbarSearchUpdateSelected'><span></span>Update Selected</li>";

        //$(".ui-layout-north .toolbar").append(html);

    }
    else if (page == "register") {
        toolbarRegister();
        //html = "<li id='tbarSetMolecules' class='first'><span></span>Set Molecules</li>" +
        //"<li id='tbarRegSchema'><span></span>Register Scheme</li>" +
        //"<li id='tbarRegStoic'><span></span>Register Stoichiometry</li>" +
        //"<li id='tbarRegWork'><span></span>Register Workup</li>" +
        //"<li id='tbarRegAll'><span></span>Register ALL</li>";
        //$(".ui-layout-north .toolbar").append(html);

    }
    else if (page == "view") {
        toolbarView();
        //html = "<li id='tbarOpenUpdate' class='first'><span></span>Update Reaction</li>";
        //$(".ui-layout-north .toolbar").append(html);

    }
    else if (page == "enum") {
        toolbarEnum();
    }
    else if (page == "decomp") {
        toolbarDecomp();
    }
    else { //template
        toolbarLogin();
        //html = "<li id='tbarLogin' class='first'><span></span>Login</li>";
        //$(".ui-layout-north .toolbar").append(html);
    }

}

function appendMain(page) {
    html = "";
    header = "";
    if (page == "search") {
        header = "Reaction Search";
        html = createSearchHtml();
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
        $(function () {
            $("#tabsSearch").tabs({
                event: "mouseover"
            });
        });
        //$(function () {
        //    $("#txtDateCrea").datepicker();
        //});
        $(function () {
            $(document).tooltip();
        });
    }
    else if (page == "register") {
        header = "Reaction Register";
        html = createRegisterHtml();
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
        $('input[type="text"]').keyup(resizeInput).each(resizeInput).change(resizeInput);

        viewAccordion();

        $("#editReaction").click(function () {
            editReaction();
        });
        $(function () {
            $('#TextAreaLiter').textarea({
                'maxChars': 1800,
                'charLimitMessage': '{ENTERED} of {MAX} characters, {REMAINING} left'
            });
        });
        if (server.indexOf("localhost") == -1) {
//        	var dataOb = getProjects()
//            var mydata = [];
//            dataOb.forEach(function (item) {
//                mydata.push(item.NAME);
//            })
        }
        
//        createAutocompleteList('txtProject', mydata);

        //$(function () {
        //    $('#txtProject').momboBox({
        //        data: mydata
        //    })
        //});
        $('.mombobutton').hide();
        $('#txtProject').css('width', '200px');
        $('#txtNotebook').css('width', '100px');
        $('#file').css('width', '300px');
        $('#ButDocSave').css('width', '300px');
        $('#ButDocDelete').css('width', '300px');
        

        $('#file').click(function () {
            $('#txtDocName').val('');
            $('#txtDocDesc').val('');
            $('#txtDocFile').val('');
            $('#downFile').html('');
        });
        $('#file').change(function () {
            var fileName = $(this).val().split('/').pop().split('\\').pop();
            $('#txtDocFile').val(fileName);
        });
        $(".detail")
          .change(function () {
              expCurrent.isDetailChanged = true;
          })

        $("#ketcherContainer").hide();
        //if (CKEDITOR.instances["editor1"] != undefined) {
        //    CKEDITOR.instances["editor1"].on('change', function () { alert('test 1 2 3') });
        //}
    }
    else if (page == "view") {
        header = "Reaction View";
        html = createViewHtml();
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
        $('input[type="text"]').keyup(resizeInput).each(resizeInput).change(resizeInput);

        viewAccordion();
    }
    else if (page == "enum") {
        header = "Enumeration";

        var sheet = document.createElement('style')
        var css = " .ui-tabs-vertical { width: 120em; } " +
        " .ui-tabs-vertical .ui-tabs-nav { padding: .2em .1em .2em .2em; float: left; width: 12em; } " +
        " .ui-tabs-vertical .ui-tabs-nav li a { display:block; } " +
        " .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active { padding-bottom: 0; padding-right: .1em; border-right-width: 1px; border-right-width: 1px; } " +
        " .ui-tabs-vertical .ui-tabs-panel { padding: 1em; float: left; width: 105em;}";

        sheet.innerHTML = css;
        document.body.appendChild(sheet);

        html = createEnumHtml();
        $(function () {
            $("#tabs").tabs();
        });
        $(function () {
            $("#tabsV").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
            $("#tabsV li").removeClass("ui-corner-top").addClass("ui-corner-left");
        });
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
    }
    else if (page == "decomp") {
        header = "Decomposition";
        html = createDecompHtml();
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
    }
    else { //template
        html = createLoginHtml();
        $("#mainContent .ui-layout-content").append(html);
        $("#mainContent .header").append(header);
    }


}

//function enterAStepCallback(obj) {
//    var step_num = obj.attr('rel'); // get the current step number

//    if (step_num == 1) {
//        if (notebook != undefined || notebook != "") {
//            loadExperiment(notebook, page);
//        }
////        alert("step 1");
//    }
//}

function appendTreviewFullname() {
//    var names = get("/Reaction.asmx/GetTest", "{'cns':''}");

    var names = get("/Reaction.asmx/GetUsersFullname", "{'cns':''}");
    var html = "<ul>";
    names = JSON.parse("[" + names + "]"); ;
    $.each(names[0], function (key, value) {
        html = html + "<li class='folder' id = '" + value.FULLNAME + "' isLazy=true data='icon: \"/js/vendor/jquery.dynatree/skin-custom/PersonIcon16.gif\"'>" + value.FULLNAME;
    });
    html = html + "</ul>";
    $("#tree").append(html);
}
 
function createLoginHtml() {
    var html = "<table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Username</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtUser' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Password</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtPwd' class ='viewTxt' type='password'/>" +
"                                                </td>" +
"                                            </tr>" +
"                    </table>";
    return html;
}

function createEnumHtml() {
    var html =
    "<div id='tabs'>" +
    "   <ul> " +
    "       <li><a href='#tabs-1'>Reaction Template</a></li> " +
    "       <li><a href='#tabs-2'>Reactives</a></li>" +
    "       <li><a href='#tabs-3'>Enumerated Reactions</a></li>" +
    "   </ul>" +
    "   " +
    "   <div id='tabs-1'>" +
    "       <div id='reactEnum'></div>" +
    "   </div>" +
    "   <div id='tabs-2'>" +
    "       <div id='reactives'></div>" +
    "   </div>" +
    "   <div id='tabs-3'>" +
    "       <div id='tabsV'> " +
    "           <ul>" +
    "           </ul>" +
    "           " +
    "       </div>" +
    "   </div>" +
    "   <div id='blueimp-gallery-dialog' data-show='fade' data-hide='fade'>" +
    "    <div class='blueimp-gallery blueimp-gallery-carousel blueimp-gallery-controls'>" +
    "        <div class='slides'></div> " +
    "        <a class='prev'><</a>" +
    "        <a class='next'>></a> " +
    "        <a class='play-pause'></a>" +
    "    </div> " +
    "   </div>" +
    "</div>";
    return html;
}

function createDecompHtml() {
    var html = "<div id='gri'>" +
"                    <table id='myGrid'></table>" +
"                    <div id='gridpager'></div> " +
"               </div>";
    return html;
}

function createSearchHtml() {

    var html = "" +
"                    <table>" +
"                        <tr>" +
"                            <td style='width:100%'>" +
"                                <div id='gri'>" +
"                                    <table id='myGrid'></table>" +
"                                    <div id='gridpager'></div> " +
"                                </div>" +
"                            </td>" +
"                        </tr>" +
"                        <tr>" +
"                            <td>" +
"                                <div id='resizeMolS' class='ui-widget-content resizeMol'>" +
"                                     <div id='reaction'>" +
"                                     </div>" +
"                                 </div>" +
"                            </td>" +
"                        </tr>" +
"                    </table>" +
    "<div id='tabsSearch'>" +
    "  <ul>" +
    "    <li><a href='#tabsSearch-1'>Reaction</a></li>" +
    "    <li><a href='#tabsSearch-2'>Text</a></li>" +
    "  </ul>" +
    "  <div id='tabsSearch-1'>" +
"                    <div style='width:100%;height:100%;'>" +
"                                <div >" +
"                                        <iframe onload='' id='ketcherFrame' name='ketcherFrame' style='width:1000px;height:530px;border-style:none' src='/js/vendor/ketcher/ketcher.html' scrolling='no'></iframe>" +
"                                </div>" +
"                    </div> " +
    "  </div>" +
    "  <div id='tabsSearch-2'>" +
"                <table>" +
"                    <tr id='detailR'>" +
"                        <td>" +
"                            <table>" +
"                                <tr>" +
"                                    <td id='leftDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Title</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtTitle' class ='viewTxt query' type='text' title='Es. = \"Oxidation\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Literature Ref.</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtLitRef' class ='viewTxt query' type='text' title='Es. like \"%JACS%\" (Contains)'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Project</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtProject' class ='viewTxt query' type='text'/ title='Es. like \"NMPERK%\" (Start with)'>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Batch Creator</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtBatchCrea' class ='viewTxt query' type='text' title='Es. like \"&De Cillis\"'(End with)/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Notebook</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtNotebook' class ='viewTxt query' type='text' title='Es. = \"00000002\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                    <td id='rightDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Creation Date</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtDateCrea' class ='viewTxt query' type='text' title='Es. between \"01/07/20014\" and \"31/07/20014\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >From Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtFromRxn' class ='viewTxt query' type='text' title='Es. = \"00000002\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >To Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtToRxn' class ='viewTxt query' type='text' title='Es. = \"00000002\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Successful Reaction</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtSuccRea' class ='viewTxt query' type='text' title='Es. = \"Y\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Page</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtPage' class ='viewTxt query' type='text' title='Es. = \"0099\"'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Yield</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtYield' class ='viewTxt query' type='text' title='Es. > 95'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                </tr>" +
"                            </table>" +
"                        </td>" +
"                    </tr>" +
//"                    <tr id='detailLiterature'>" +
//"                        <td>" +
//"                            <label class='viewLabel' >Literature Ref.</label>" +
//"                            <input id='viewLit' class ='viewTxt' type='text'/>" +
//"                        </td>" +
//"                    </tr>" +
"                </table>" +
    "  </div>" +
    "</div>";

    return html;
}

function createViewHtml() {
    var html = "" +
"    <table width='100%'>" +
"        <tr id='reactionDetaiid='>" +
"            <td>" +
"                <table>" +
"        <tr id='reactionDetaiid='>" +
"            <td>" +

"                <table>" +
"                    <tr id='detailR'>" +
"                        <td>" +

"                            <table>" +
"                                <tr>" +
"                                   <td>" +

"                            <table>" +
"                                <tr>" +
"                                    <td id='leftDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Title</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtTitle' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Yield</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtYield' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Project</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtProject' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Batch Creator</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtBatchCrea' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Notebook</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtNotebook' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                    <td id='rightDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Creation Date</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtDateCrea' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >From Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtFromRxn' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >To Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtToRxn' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Successful Reaction</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtSussRea' class ='viewTxt' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Page</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtPage' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                </tr>" +
"                            </table>" +

"                                   </td>" +
"                                   <td>" +
"                            <label class='viewLabel' >Literature Ref.</label>" +
"                            <textarea id='TextAreaLiter' rows='10' cols='30'></textarea>" +
"                                   </td>" +
"                                </tr>" +
"                            </table>" +


"                        </td>" +
"                    </tr>" +
"                    <tr id='detailLiterature'>" +
"                        <td>" +
"                        </td>" +
"                    </tr>" +
"                </table>" +
"            </td>" +
"        </tr>" +


"        <tr id='reactionAccordion'>" +
"            <td>" +
"               <div class='toggle-box'>" +
"                 <div class='toggle-title'>Reaction Scheme</div>" +
    "                 <div id='scheme' class='toggle-content'>" +
"                                <div id='resizeMolV' class='ui-widget-content resizeMol'>" +
"                                     <div id='reaction'>" +
"                                     </div>" +
"                                 </div>" +

"                        <table>" +
"                            <tr id='RSrow1'>" +
"                                <td>" +
"                                </td>" +
"                                <td id='RScol2'>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +


        "            </div>" +
"                 <div id='stoich' class='toggle-title'>Stoichiometry</div>" +
"                   <div class='toggle-content'>" +
"                        <table>" +
"                            <tr id='reagenti'>" +
"                                <td>" +
"                                <div id='gridR'>" +
"                                    <table id='myReactant'></table>" +
"                                    <div id='reactantspager'></div> " +
"                                </div>" +
"                                </td>" +
"                            </tr>" +
"                            <tr id='prodotti'>" +
"                                <td>" +
"                                <div id='gridP'>" +
"                                    <table id='myProducts'></table>" +
"                                    <div id='Productspager'></div> " +
"                                </div>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +
            "       </div>" +
"                <div id='workup' class='toggle-title'>Reaction & Workup Procedure</div>" +
"                <div class='toggle-content'>" +
"                    <div>" +
"			            <textarea class='ckeditor' cols='80' id='editor1' name='editor1' rows='10'> " +
"			            </textarea>" +
"                    </div>" +
"               </div>" +

"                <div id='attachement' class='toggle-title'>Attachments</div>" +
"                <div class='toggle-content'>" +
"                    <div>" +
"                        <table>" +
"                            <tr id='reagenti'>" +
"                                <td>" +
    "                                <div id='gridR'>" +
    "                                    <table id='myAttach'></table>" +
    "                                    <div id='attachPager'></div> " +
    "                                </div>" +
"                                </td>" +
"                                <td>" +
"                                   <table>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Name</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocName' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Description</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocDesc' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Original File</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocFile' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Download</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <div id='downFile'></div>"
    //"                                               <input id='ButDoc' class ='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover' type='button' value='Open Attachment' onclick='openAttach()'/>"
"                                           </td>" +
"                                       </tr>" +
"                                   </table>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +
"                    </div>" +
"               </div>" +

"            </td>" +
"        </tr>" +
"    </table>";

 return html;

}

function createRegisterHtml() {
    var html = ""+
"    <table width='100%'>" +
"        <tr id='reactionDetaiid='>" +
"            <td>" +

"                <table>" +
"                    <tr id='detailR'>" +
"                        <td>" +

"                            <table>" +
"                                <tr>" +
"                                   <td>" +

"                            <table>" +
"                                <tr>" +
"                                    <td id='leftDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Title</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtTitle' class ='viewTxt detail' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Yield</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtYield' class ='viewTxt detail' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Project</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtProject' class ='viewTxt detail' type='text' />" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Batch Creator</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtBatchCrea' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Notebook</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtNotebook' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                    <td id='rightDetaiid='>" +
"                                        <table>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Creation Date</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtDateCrea' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >From Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtFromRxn' class ='viewTxt detail' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >To Rxn</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtToRxn' class ='viewTxt detail' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Successful Reaction</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtSussRea' class ='viewTxt detail' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                            <tr>" +
"                                                <td>" +
"                                                    <label class='viewLabel' >Page</label>" +
"                                                </td>" +
"                                                <td>" +
"                                                    <input id='txtPage' class ='viewTxt notenabled' type='text'/>" +
"                                                </td>" +
"                                            </tr>" +
"                                        </table>" +
"                                    </td>" +
"                                </tr>" +
"                            </table>" +

"                                   </td>" +
"                                   <td>" +
"                            <label class='viewLabel' >Literature Ref.</label>" +
"                            <textarea id='TextAreaLiter' rows='10' cols='30' class='detail'></textarea>" +
"                                   </td>" +
"                                </tr>" +
"                            </table>" +


"                        </td>" +
"                    </tr>" +
"                    <tr id='detailLiterature'>" +
"                        <td>" +
"                        </td>" +
"                    </tr>" +
"                </table>" +
"            </td>" +
"        </tr>" +

"        <tr id='reactionAccordion'>" +
"            <td>" +
"               <div class='toggle-box'>" +
"                 <div class='toggle-title'>Reaction Scheme</div>" +
"                 <div id='scheme' class='toggle-content'>" +
"                        <table>" +
"                            <tr id='rea'>" +
"                                <td>" +
    "                                <div id='resizeMolA' class='ui-widget-content resizeMol'>" +
    "                                     <div id='reaction'>" +
    "                                     </div>" +
    "                                 </div>" +
                "                    <div id = 'ketcherContainer' style='width:100%;height:100%;'>" +
                "                                <div >" +
                "                                        <iframe onload='' id='ketcherFrame' name='ketcherFrame' style='width:800px;height:550px;border-style:none' src='/js/vendor/ketcher/ketcher.html' scrolling='no'></iframe>" +
                "                                </div>" +
                "                    </div> "+
"                                </td>" +
"                            </tr>" +
"                        </table>" +

"                        <table>" +
"                            <tr id='RSrow1'>" +
"                                <td>" +
"                                    <input id='editReaction' class ='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' type='button' value='Edit Reaction' />" +
"                                </td>" +
"                                <td id='RScol2'>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +
"                 </div>" +
"                 <div id='stoich' class='toggle-title'>Stoichiometry</div>" +
"                   <div class='toggle-content'>" +
"                        <table>" +
"                            <tr id='reagenti'>" +
"                                <td>" +
"                                <div id='gridR'>" +
"                                    <table id='myReactant'></table>" +
"                                    <div id='reactantspager'></div> " +
"                                </div>" +
"                                </td>" +
"                            </tr>" +
"                            <tr id='prodotti'>" +
"                                <td>" +
"                                <div id='gridP'>" +
"                                    <table id='myProducts'></table>" +
"                                    <div id='Productspager'></div> " +
"                                </div>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +
            "       </div>" +
"                <div id='workup' class='toggle-title'>Reaction & Workup Procedure</div>" +
"                <div class='toggle-content'>" +
"                    <div>" +
"			            <textarea class='ckeditor' cols='80' id='editor1' name='editor1' rows='10'> " +
"			            </textarea>" +
"                    </div>" +
"               </div>" +

"                <div id='attachement' class='toggle-title'>Attachments</div>" +
"                <div class='toggle-content'>" +
"                    <div>" +
"                        <table>" +
"                            <tr id='reagenti'>" +
"                                <td>" +
    "                                <div id='gridR'>" +
    "                                    <table id='myAttach'></table>" +
    "                                    <div id='attachPager'></div> " +
    "                                </div>" +
"                                </td>" +
"                                <td>" +
"                                   <table>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Name</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocName' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Description</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocDesc' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Original File</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <input id='txtDocFile' class ='viewTxt' type='text'/>" +
"                                           </td>" +
"                                       </tr>" +
"                                       <tr >" +
"                                           <td>" +
"                                               <label class='viewLabel' >Download</label>" +
"                                           </td>" +
"                                           <td>" +
"                                               <div id='downFile'></div>" +
"                                           </td>" +
"                                       </tr>" +


"                                       <tr >" +
"                                           <td> " +
"                                           </td>" +
"                                           <td>" +

"                                               <form enctype='multipart/form-data' method='post' name='fileinfo'>" +
"                                                   <table>" +
"                                                       <tr >" +
"                                                           <td> " +
"                                                               <div class='upload'> <input id='file' type='file' name='file' required class ='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover'/></div>" +
"                                                           </td>" +
"                                                       </tr>" +
"                                                       <tr >" +
"                                                           <td> " +
"                                                               <input id='ButDocSave'  onclick='sendFile()' value='Save the attachment' class ='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover'/>" +
"                                                           </td>" +
"                                                       </tr>" +
"                                                       <tr >" +
"                                                           <td> " +
"                                                               <input id='ButDocDelete'  onclick='deleteFile()' value='Delete the attachment' class ='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover'/>" +
"                                                           </td>" +
"                                                       </tr>" +
"                                                   </table>" +
"                                               </form>" +
"                                           </td>" +
"                                       </tr>" +

"                                   </table>" +
"                                </td>" +
"                            </tr>" +
"                        </table>" +
"                    </div>" +
"               </div>" +

"            </td>" +
"        </tr>" +
"    </table>";

    return html;

}

function toolbarSearch() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            {
                type: 'menu', id: 'Search', caption: 'Search Reaction', img: 'fa-book', items: [
                  { text: 'SSS', icon: 'icon-page', id: 'item2' },
                  { text: 'Exact', icon: 'icon-page', id: 'item3' }
                ]
            },
            {
                type: 'menu', id: 'SearchText', caption: 'Search Text', img: 'fa-book', items: [
                  { text: 'AND', icon: 'icon-page', id: 'item2' },
                  { text: 'OR', icon: 'icon-page', id: 'item3' }
                ]
            },
            { type: 'break', id: 'break1' },
            { type: 'button', id: 'Clear', caption: 'Clear', img: 'icon-save' },
            { type: 'button', id: 'View Selected', caption: 'View Selected', img: 'icon-save' },
            { type: 'button', id: 'Update Selected', caption: 'Update Selected', img: 'icon-save' },
            { type: 'spacer' }
        ],
        onClick: function (event) {
            if (event.target == "Search") {
                if (event.subItem != undefined) {
                    if (event.subItem.text == "SSS") {
                        searchSSS();
                    } else if (event.subItem.text == "Exact") {
                        searchExact();
                    }
                }
            }
            else if (event.target == "SearchText") {
                if (event.subItem != undefined) {
                    if (event.subItem.text == "AND") {
                        searchText('and');
                    } else if (event.subItem.text == "OR") {
                        searchText('or');
                    }
                }
            }
            else if (event.target == "Clear") {
                Clear();
            }
            else if (event.target == "View Selected") {
                var grid = $("#myGrid");
                var notebook = getCellValueSelected(grid, 'notebook');
                var page = getCellValueSelected(grid, 'page');
                viewExperiment(notebook, page, false);
            }
            else if (event.target == "Update Selected") {
                var grid = $("#myGrid");
                var notebook = getCellValueSelected(grid, 'notebook');
                var page = getCellValueSelected(grid, 'page');
                openUpdate(notebook, page, false);
                //updateExperiment(notebook, page, false);
            }
        }
    });
}

function toolbarRegister() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'CreateExp', caption: 'Create New', img: 'icon-save' },
            { type: 'button', id: 'CleareExp', caption: 'Clear', img: 'icon-save' },
            { type: 'button', id: 'CopyExp', caption: 'Copy', img: 'icon-save' },
            { type: 'break', id: 'break1' },
            {
                type: 'menu', id: 'Register', caption: 'Register', img: 'fa-book', items: [
                  { text: 'All', icon: 'icon-page', id: 'item2' },
                  { text: 'Detail', icon: 'icon-page', id: 'item10' },
                  { text: 'Scheme', icon: 'icon-page', id: 'item3' },
                  { text: 'Stoichiometry', icon: 'icon-page', id: 'item4' },
                  { text: 'Procedure', icon: 'icon-page', id: 'item5' }
                ]
            },
            { type: 'break', id: 'break1' },
            { type: 'button', id: 'SetMolecule', caption: 'Set Molecule', img: 'icon-save' },
            { type: 'button', id: 'FindAll', caption: 'Find All', img: 'icon-save' },
            {
                type: 'menu', id: 'Add', caption: 'Add', img: 'fa-book', items: [
                  { text: 'Reagent from Chemtools', icon: 'icon-page', id: 'item6' },
                  { text: 'Product from Chemtools', icon: 'icon-page', id: 'item7' },
                  { text: 'Reagent from Bottle', icon: 'icon-page', id: 'item8' },
                  { text: 'Product from Bottle', icon: 'icon-page', id: 'item9' },
                  { text: 'Solvent', icon: 'icon-page', id: 'item10' }
]
            },
            { type: 'spacer' },
            { type: 'button', id: 'delExperiment', caption: 'Delete Experiment', img: 'icon-save' }
        ],
        onClick: function (event) {
            if (event.target == "Register") {
                if (event.subItem != undefined) {
                    if (event.subItem.text == "All") {
                        regAll();
                    }
                    else if (event.subItem.text == "Scheme") {
                        regSchema();
                    }
                    else if (event.subItem.text == "Stoichiometry") {
                        regStoic();
                    }
                    else if (event.subItem.text == "Procedure") {
                        regWork();
                    }
                    else if (event.subItem.text == "Detail") {
                        regDetail();
                    }
                }
            }
            else if (event.target == "Add") {
                if (event.subItem != undefined) {
                    if ($('#editReaction').is(":visible")) {
                        editReaction();
                    }
                    else {
                        editKetcher();
                    }
                    
                    clearSearchCT();
                    $('.addCT').html("");

                    if (event.subItem.text == "Reagent from Chemtools") {
                        //popupChemtools();
                        $("#dialog-Print").dialog("open");
                        $("#dialog-Print").dialog({ title: "Reagent from Chemtools" });
                        var html = "" +
                            "<select style='width: 150px'>" +
                            "<option value='Batch'>Batch</option>"+
                            "<option value='CorpId'>CorpId</option>" +
                            "</select>"
                        $('.addCT').append(html)
                    }
                    else if (event.subItem.text == "Product from Chemtools") {
                        $("#dialog-Print").dialog("open");
                        $("#dialog-Print").dialog({ title: "Product from Chemtools" });
                        var html = "" +
                            "<select style='width: 150px'>" +
                            "<option value='Batch'>Batch</option>" +
                            "<option value='CorpId'>CorpId</option>" +
                            "</select>"
                        $('.addCT').append(html)
                    }
                    else if (event.subItem.text == "Reagent from Bottle") {
                        $("#dialog-Print").dialog("open");
                        $("#dialog-Print").dialog({ title: "Reagent from Bottle" });
                        var html = "" +
                            "<select style='width: 150px'>" +
                            "<option value='StrId'>StrId</option>" +
                            "<option value='BottleId'>BottleId</option>" +
                            "<option value='CAS'>CAS</option>" +
                            "</select>"
                        $('.addCT').append(html)
                    }
                    else if (event.subItem.text == "Product from Bottle") {
                        $("#dialog-Print").dialog("open");
                        $("#dialog-Print").dialog({ title: "Product from Bottle" });
                        var html = "" +
                            "<select style='width: 150px'>" +
                            "<option value='StrId'>StrId</option>" +
                            "<option value='BottleId'>BottleId</option>" +
                            "<option value='CAS'>CAS</option>" +
                            "</select>"
                        $('.addCT').append(html)
                    }
                    else if (event.subItem.text == "Solvent") {
                            $("#dialog-Print").dialog("open");
                            $("#dialog-Print").dialog({ title: "Solvent" });
                            var html = "" +
                                "<select style='width: 150px'>" +
                                "<option value='StrId'>StrId</option>" +
                                "<option value='BottleId'>BottleId</option>" +
                                "<option value='CAS'>CAS</option>" +
                                "</select>"
                            $('.addCT').append(html)
                        }
                }
            }
            else if (event.target == "SetMolecule") {
                setMolecules();
            }
            else if (event.target == "FindAll") {
                FindAll();
            }
            else if (event.target == "delExperiment") {
                openDialog(event.target);
            }
            else if (event.target == "CleareExp") {
                cleareExp();
            }
            else if (event.target == "CreateExp") {
                createNewExp();
            }
            else if (event.target == "CopyExp") {
                copyExp();
            }
        }
    });
}

function toolbarView() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'UpdateReaction', caption: 'Update Reaction', img: 'icon-save' },
            { type: 'spacer' }
        ],
        onClick: function (event) {
            if (event.target == "UpdateReaction") {
                openUpdate($("#txtNotebook").val(), $("#txtPage").val(), self);
            }
        }
    });
}

function toolbarLogin() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'Login', caption: 'Login', img: 'icon-save' },
            { type: 'spacer' }
        ],
        onClick: function (event) {
            if (event.target == "Login") {
                login($('#txtUser').val(), $('#txtPwd').val());
            }
        }
    });
}

function toolbarDecomp() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'Decomposition', caption: 'Decomposition', img: 'icon-save' },
            { type: 'spacer' }
        ],
        onClick: function (event) {
            if (event.target == "Decomposition") {
                viewDecomp();
            }
        }
    });
}

function toolbarEnum() {
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'Enumerate', caption: 'Enumerate', img: 'icon-save' },
            { type: 'button', id: 'DrawReaction', caption: 'Draw Reaction', img: 'icon-save' },
            { type: 'button', id: 'LoadReactive', caption: 'Load Reactive', img: 'icon-save' },
            { type: 'button', id: 'SaveReactEnum', caption: 'Save Enumerated Reactions', img: 'icon-save' },
            { type: 'spacer' },
            { type: 'button', id: 'RemoveList', caption: 'Remove List', img: 'icon-save' }
        ],
        onClick: function (event) {
            if (event.target == "Enumerate") {
                openDialog(event.target)                
            }
            else if (event.target == "DrawReaction") {
                drawReaction();
            }
            else if (event.target == "LoadReactive") {
                loadReactive();
            }
            else if (event.target == "SaveReactEnum") {
                openDialog(event.target)
            }
            else if (event.target == "RemoveList") {
                openDialog(event.target)
            }
        }
    });
}

function openDialog(name) {
    if (name == "SaveReactEnum") {
        $("#dialog-Input").dialog("open");
        $("#dialog-Input").dialog({ title: "Save Enumerated Experiment" });
        $("#lblInput")[0].value = "Enumerated Reaction Experiment";
        $(".ui-button-text:contains('All List')").parent().hide();
    }
    else if (name == "RemoveList") {
        $("#dialog-Input").dialog("open");
        $("#dialog-Input").dialog({ title: "Remove List" });
        $("#lblInput")[0].value = "Remove Reactions List";
        $(".ui-button-text:contains('All List')").parent().show();
    }
    else if (name == "Enumerate") {
        $("#dialog-Input").dialog("open");
        $("#dialog-Input").dialog({ title: "Enumerate reaction" });
        $("#lblInput")[0].value = "Amount in mMole";
        $(".ui-button-text:contains('All List')").parent().hide();
    }
    else if (name == "delExperiment") {
        $("#dialog-Input").dialog("open");
        $("#dialog-Input").dialog({ title: "Are you sure to delete Experiment?" });
        $("#lblInput")[0].value = "Experiment";
        $("#txtInput")[0].value = expCurrent.id;
        
        $(".ui-button-text:contains('All List')").parent().hide();
    }
    else if (name == "changeExperiment") {
            $("#dialog-Input").dialog("open");
            $("#dialog-Input").dialog({ title: "Experiment is changed. Do you want to leave it?" });
            $("#lblInput")[0].value = "Experiment Changement";
            $("#txtInput")[0].value = expCurrent.checkChanging();

            $(".ui-button-text:contains('All List')").parent().hide();
        }
}

//$('#toolbar').w2toolbar({
//    name: 'toolbar',
//    items: [
//        { type: 'check', id: 'item1', caption: 'Check', img: 'icon-page', checked: true },
//        { type: 'break', id: 'break0' },
//        {
//            type: 'menu', id: 'item2', caption: 'Drop Down', img: 'icon-folder', items: [
//              { text: 'Item 1', icon: 'icon-page' },
//              { text: 'Item 2', icon: 'icon-page' },
//              { text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
//            ]
//        },
//        { type: 'break', id: 'break1' },
//        { type: 'radio', id: 'item3', group: '1', caption: 'Radio 1', img: 'icon-add', checked: true },
//        { type: 'radio', id: 'item4', group: '1', caption: 'Radio 2', img: 'icon-add' },
//        { type: 'spacer' },
//        { type: 'button', id: 'item5', caption: 'Item 5', img: 'icon-save' }
//    ]
//});