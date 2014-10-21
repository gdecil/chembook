// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        // assign each event handler a unique ID
        if (!handler.$$guid) handler.$$guid = addEvent.guid++;
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            // store the existing event handler (if there is one)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = handleEvent;
    }
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    }
};

function handleEvent(event) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};

function fixEvent(event) {
    // add W3C standard event methods
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function () {
    this.returnValue = false;
};
fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
};

function createAutocompleteList(textName, data) {

    //var source = ['jQuery', 'Dojo', 'ExtJs', 'Prototype', 'Java', 'Android', 'MySQL', 'PHP'];

    //    var source = [<% Response.Write( this.GetTestString()); %>];
    //alert($("input#myDropDown"));
    $("#" + textName).autocomplete({
        minLength: 0,
        source: data,
        autoFocus: true,
        scroll: true
    }).focus(function () {
        $(this).autocomplete("search", "");
    }).live("blur", function (event) {
        var autocomplete = $(this).data("autocomplete");
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
        autocomplete.widget().children(".ui-menu-item").each(function () {
            //Check if each autocomplete item is a case-insensitive match on the input
            var item = $(this).data("item.autocomplete");
            if (matcher.test(item.label || item.value || item)) {
                //There was a match, lets stop checking
                autocomplete.selectedItem = item;
                return;
            }
        });
        //if there was a match trigger the select event on that match
        if (autocomplete.selectedItem) {
            autocomplete._trigger("select", event, {
                item: autocomplete.selectedItem
            });
            //there was no match, clear the input
        }
        //else {
        //$(this).val('');
        //}
    });

}

function createAutocompleteListClass(classe, data) {

    //var data = ['jQuery', 'Dojo', 'ExtJs', 'Prototype', 'Java', 'Android', 'MySQL', 'PHP'];

    //    var source = [<% Response.Write( this.GetTestString()); %>];
    //alert($("input#myDropDown"));
    $("." + classe).autocomplete({
        minLength: 0,
        source: data,
        autoFocus: true,
        scroll: true
    }).focus(function () {
        $(this).autocomplete("search", "");
    }).live("blur", function (event) {
        var autocomplete = $(this).data("autocomplete");
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
        autocomplete.widget().children(".ui-menu-item").each(function () {
            //Check if each autocomplete item is a case-insensitive match on the input
            var item = $(this).data("item.autocomplete");
            if (matcher.test(item.label || item.value || item)) {
                //There was a match, lets stop checking
                autocomplete.selectedItem = item;
                return;
            }
        });
        //if there was a match trigger the select event on that match
        if (autocomplete.selectedItem) {
            autocomplete._trigger("select", event, {
                item: autocomplete.selectedItem
            });
            //there was no match, clear the input
        }
        else {
            $(this).val('');
        }
    });

}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function sendFile() {
    if ($('#txtDocName').val()=="") {
        alert("Please insert a document name")
        return
    }

    var formData = new FormData(); //var formData = new FormData($('form')[0]);
    formData.append('file', $('#file')[0].files[0]);
    formData.append('nb', expCurrent.notebook);
    formData.append('exper', expCurrent.page);
    formData.append('Name', $('#txtDocName').val());
    formData.append('Description', $('#txtDocDesc').val());
    formData.append('Original', $('#txtDocFile').val());

    ///AJAX request
    $.ajax(
    {
        ///server script to process data
        url: server + "/Fileupload.ashx", //web service
        type: 'POST',
        complete: function () {
            var grid = $("#myAttach");
            grid.jqGrid('GridUnload');
            cgAttach($.parseJSON(expCurrent.getAttachement()));
        },
        progress: function (evt) {
            //progress event    
        },
        ///Ajax events
        beforeSend: function (e) {
            //before event  
        },
        success: function (e) {
            //success event
        },
        error: function (e) {
            //errorHandler
        },
        ///Form data
        data: formData,
        ///Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
}

function HtmlEncode1(str) {
str = str.replace(/&/g, "&amp;"); 
str = str.replace(/</g, "&lt;"); 
str = str.replace(/>/g, "&gt;"); 
str = str.replace(/¡/g, "&iexcl;");
str = str.replace(/¢/g, "&cent;");
str = str.replace(/£/g, "&pound;");
str = str.replace(/¤/g, "&curren;");
str = str.replace(/¥/g, "&yen;");
str = str.replace(/¦/g, "&brvbar;");
str = str.replace(/§/g, "&sect;");
str = str.replace(/¨/g, "uml;");
str = str.replace(/©/g, "&copy;");
str = str.replace(/ª/g, "&ordf;");
str = str.replace(/«/g, "&laquo;");
str = str.replace(/¬/g, "&not;");
str = str.replace(/®/g, "&reg;");
str = str.replace(/¯/g, "&macr;");
str = str.replace(/°/g, "&deg;");
str = str.replace(/±/g, "&plusmn;");
str = str.replace(/²/g, "&sup2;");
str = str.replace(/³/g, "&sup3;");
str = str.replace(/´/g, "&acute;");
str = str.replace(/µ/g, "&micro;");
str = str.replace(/¶/g, "&para;");
str = str.replace(/·/g, "&middot;");
str = str.replace(/¸/g, "&cedil;");
str = str.replace(/¹/g, "&sup1;");
str = str.replace(/º/g, "&ordm;");
str = str.replace(/»/g, "&raquo;");
str = str.replace(/¼/g, "&frac14;");
str = str.replace(/½/g, "&frac12;");
str = str.replace(/¾/g, "&frac34;");
str = str.replace(/¿/g, "&iquest;");
str = str.replace(/À/g, "&Agrave;");
str = str.replace(/Á/g, "&Aacute;");
str = str.replace(/Â/g, "&Acirc;");
str = str.replace(/Ã/g, "&Atilde;");
str = str.replace(/Ä/g, "&Auml;");
str = str.replace(/Å/g, "&Aring;");
str = str.replace(/Æ/g, "&AElig;");
str = str.replace(/Ç/g, "&Ccedil;");
str = str.replace(/È/g, "&Egrave;");
str = str.replace(/É/g, "&Eacute;");
str = str.replace(/Ê/g, "&Ecirc;");
str = str.replace(/Ë/g, "&Euml;");
str = str.replace(/Ì/g, "&Igrave;");
str = str.replace(/Í/g, "&Iacute;");
str = str.replace(/Î/g, "&Icirc;");
str = str.replace(/Ï/g, "&Iuml;");
str = str.replace(/Ð/g, "&ETH;");
str = str.replace(/Ñ/g, "&Ntilde;");
str = str.replace(/Ò/g, "&Ograve;");
str = str.replace(/Ó/g, "&Oacute;");
str = str.replace(/Ô/g, "&Ocirc;");
str = str.replace(/Õ/g, "&Otilde;");
str = str.replace(/Ö/g, "&Ouml;");
str = str.replace(/×/g, "&times;");
str = str.replace(/Ø/g, "&Oslash;");
str = str.replace(/Ù/g, "&Ugrave;");
str = str.replace(/Ú/g, "&Uacute;");
str = str.replace(/Û/g, "&Ucirc;");
str = str.replace(/Ü/g, "&Uuml;");
str = str.replace(/Ý/g, "&Yacute;");
str = str.replace(/Þ/g, "&THORN;");
str = str.replace(/ß/g, "&szlig;");
str = str.replace(/à/g, "&agrave;");
str = str.replace(/á/g, "&aacute;");
str = str.replace(/â/g, "&acirc;");
str = str.replace(/ã/g, "&atilde;");
str = str.replace(/ä/g, "&auml;");
str = str.replace(/å/g, "&aring;");
str = str.replace(/æ/g, "&aelig;");
str = str.replace(/ç/g, "&ccedil;");
str = str.replace(/è/g, "&egrave;");
str = str.replace(/é/g, "&eacute;");
str = str.replace(/ê/g, "&ecirc;");
str = str.replace(/ë/g, "&euml;");
str = str.replace(/ì/g, "&igrave;");
str = str.replace(/í/g, "&iacute;");
str = str.replace(/î/g, "&icirc;");
str = str.replace(/ï/g, "&iuml;");
str = str.replace(/ð/g, "&eth;");
str = str.replace(/ñ/g, "&ntilde;");
str = str.replace(/ò/g, "&ograve;");
str = str.replace(/ó/g, "&oacute;");
str = str.replace(/ó/g, "&oacute;");
str = str.replace(/ô/g, "&ocirc;");
str = str.replace(/õ/g, "&otilde;");
str = str.replace(/ö/g, "&ouml;");
str = str.replace(/÷/g, "&divide;");
str = str.replace(/ø/g, "&oslash;");
str = str.replace(/ù/g, "&ugrave;");
str = str.replace(/ú/g, "&uacute;");
str = str.replace(/û/g, "&ucirc;");
str = str.replace(/ü/g, "&uuml;");
str = str.replace(/ý/g, "&yacute;");
str = str.replace(/þ/g, "&thorn;");
str = str.replace(/ÿ/g, "&yuml;");
str = str.replace(/ƒ/g, "&fnof;");
str = str.replace(/Α/g, "&Alpha;");
str = str.replace(/Β/g, "&Beta;");
str = str.replace(/Γ/g, "&Gamma;");
str = str.replace(/Δ/g, "&Delta;");
str = str.replace(/Ε/g, "&Epsilon;");
str = str.replace(/Ζ/g, "&Zeta;");
str = str.replace(/Η/g, "&Eta;");
str = str.replace(/Θ/g, "&Theta;");
str = str.replace(/Ι/g, "&Iota;");
str = str.replace(/Κ/g, "&Kappa;");
str = str.replace(/Λ/g, "&Lambda;");
str = str.replace(/Μ/g, "&Mu;");
str = str.replace(/Ν/g, "&Nu;");
str = str.replace(/Ξ/g, "&Xi;");
str = str.replace(/Ο /g, "&Omicron;");
str = str.replace(/Π/g, "&Pi;");
str = str.replace(/Ρ/g, "&Rho;");
str = str.replace(/Σ/g, "&Sigma;");
str = str.replace(/Τ/g, "&Tau;");
str = str.replace(/Υ/g, "&Upsilon;");
str = str.replace(/Φ/g, "&Phi;");
str = str.replace(/Χ/g, "&Chi;");
str = str.replace(/Ψ/g, "&Psi;");
str = str.replace(/Ω/g, "&Omega;");
str = str.replace(/α/g, "&alpha;");
str = str.replace(/β/g, "&beta;");
str = str.replace(/γ/g, "&gamma;");
str = str.replace(/δ/g, "&delta;");
str = str.replace(/ε/g, "&epsilon;");
str = str.replace(/ζ/g, "&zeta;");
str = str.replace(/η/g, "&eta;");
str = str.replace(/θ/g, "&theta;");
str = str.replace(/ι/g, "&iota;");
str = str.replace(/κ/g, "&kappa;");
str = str.replace(/λ/g, "&lambda;");
str = str.replace(/μ/g, "&mu;");
str = str.replace(/ν/g, "&nu;");
str = str.replace(/ξ/g, "&xi;");
str = str.replace(/ο/g, "&omicron;");
str = str.replace(/π/g, "&pi;");
str = str.replace(/ρ/g, "&rho;");
str = str.replace(/ς/g, "&sigmaf;");
str = str.replace(/σ/g, "&sigma;");
str = str.replace(/τ/g, "&tau;");
str = str.replace(/υ/g, "&upsilon;");
str = str.replace(/φ/g, "&phi;");
str = str.replace(/ω/g, "&omega;");
str = str.replace(/•/g, "&bull;");
str = str.replace(/…/g, "&hellip;");
str = str.replace(/′/g, "&prime;");
str = str.replace(/″/g, "&Prime;");
str = str.replace(/‾/g, "&oline;");
str = str.replace(/⁄/g, "&frasl;");
str = str.replace(/™/g, "&trade;");
str = str.replace(/←/g, "&larr;");
str = str.replace(/↑/g, "&uarr;");
str = str.replace(/→/g, "&rarr;");
str = str.replace(/↓/g, "&darr;");
str = str.replace(/↔/g, "&harr;");
str = str.replace(/⇒/g, "&rArr;");
str = str.replace(/∂/g, "&part;");
str = str.replace(/∏/g, "&prod;");
str = str.replace(/∑/g, "&sum;");
str = str.replace(/−/g, "&minus;");
str = str.replace(/√/g, "&radic;");
str = str.replace(/∞/g, "&infin;");
str = str.replace(/∩/g, "&cap;");
str = str.replace(/∫/g, "&int;");
str = str.replace(/≈/g, "&asymp;");
str = str.replace(/≠/g, "&ne;");
str = str.replace(/≡/g, "&equiv;");
str = str.replace(/≤/g, "&le;");
str = str.replace(/≥/g, "&ge;");
str = str.replace(/◊/g, "&loz;");
str = str.replace(/♠/g, "&spades;");
str = str.replace(/♣/g, "&clubs;");
str = str.replace(/♥/g, "&hearts;");
str = str.replace(/♦/g, "&diams;");
str = str.replace(/Œ/g, "&OElig;");
str = str.replace(/œ/g, "&oelig;");
str = str.replace(/Š/g, "&Scaron;");
str = str.replace(/š/g, "&scaron;");
str = str.replace(/Ÿ/g, "&Yuml;");
str = str.replace(/ˆ/g, "&circ;");
str = str.replace(/˜/g, "&tilde;");
str = str.replace(/–/g, "&ndash;");
str = str.replace(/—/g, "&mdash;");
str = str.replace(/‘/g, "&lsquo;");
str = str.replace(/’/g, "&rsquo;");
str = str.replace(/‚/g, "&sbquo;");
str = str.replace(/“/g, "&ldquo;");
str = str.replace(/”/g, "&rdquo;");
str = str.replace(/„/g, "&bdquo;");
str = str.replace(/†/g, "&dagger;");
str = str.replace(/‡/g, "&Dagger;");
str = str.replace(/‰/g, "&permil;");
str = str.replace(/‹/g, "&lsaquo;");
str = str.replace(/›/g, "&rsaquo;");
str = str.replace(/€/g, "&euro;");
    
    
    // \x22 means '"' -- we use hex reprezentation so that we don't disturb
    // JS compressors (well, at least mine fails.. ;)
    
    str = str.replace(/\x22/ig, "&quot;");
    str = str.replace(/\xA0/gi,"&nbsp;");
    str = str.replace(String.fromCharCode(0x2264), "&#8804;"); 
    str = str.replace(String.fromCharCode(0x2265), "&#8805;");
    return str;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// ************************************************************
// convert JSON date format /Date(milliseconds)/ es /Date(1361722859000)/
// into Javascript date (without GM)
//
function convertJSONDate(date) {
    var date = new Date(parseInt(date.substr(6)));
    date = date.toString().replace(/GMT.*/g, "");
    return date;
}

function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

// ************************************************************
// var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
// 
//
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

function randomString40() {
    var length = 40;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ;
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

//left padding
$.strPad = function (i, l, s) {
    var o = i.toString();
    if (!s) { s = '0'; }
    while (o.length < l) {
        o = s + o;
    }
    return o;
};

var downloadURL = function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
};

function createAutocompleteList(container, data) {
    //usa jquery-ui autocomplete per combobox
    //var source = ['jQuery', 'Dojo', 'ExtJs', 'Prototype', 'Java', 'Android', 'MySQL', 'PHP'];

    //    var source = [<% Response.Write( this.GetTestString()); %>];
    //alert($("input#myDropDown"));
    $("#" + container).autocomplete({
        minLength: 0,
        source: data,
        autoFocus: true,
        scroll: true
    }).focus(function () {
        $(this).autocomplete("search", "");
    }).live("blur", function (event) {
        var autocomplete = $(this).data("autocomplete");
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
        autocomplete.widget().children(".ui-menu-item").each(function () {
            //Check if each autocomplete item is a case-insensitive match on the input
            var item = $(this).data("item.autocomplete");
            if (matcher.test(item.label || item.value || item)) {
                //There was a match, lets stop checking
                autocomplete.selectedItem = item;
                return;
            }
        });
        //if there was a match trigger the select event on that match
        if (autocomplete.selectedItem) {
            autocomplete._trigger("select", event, {
                item: autocomplete.selectedItem
            });
            //there was no match, clear the input
        }
        //else {
        //$(this).val('');
        //}
    });

}