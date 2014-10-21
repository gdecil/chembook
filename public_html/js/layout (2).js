function layoutSearch() {
    appendToolbar('search');
    appendMain('search');
    $(function () {
        $(".resizeMol").resizable();
    });
    $(".resizeMol").resize(function () {
        var img_height = $('#moleculeB').parent().parent().height();
        var img_width = $('#moleculeB').parent().parent().width();
        $('#moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });
    outerLayout.toggle('east');
}

function layoutRegister(notebook, page) {
    appendToolbar('register');
    appendMain('register');

    //$(function () {
    //    $("#resizable").resizable();
    //});
    //$("#resizable").resize(function () {
    //    var img_height = $('#molecule').parent().parent().height();
    //    var img_width = $('#molecule').parent().parent().width();
    //    $('#molecule').css({ 'width': img_width, 'height': img_height - 20 });
    //});

    $(function () {
        $("#resizeMolA").resizable();
    });
    $("#resizeMolA").resize(function () {
        var img_height = $('#resizeMolA').height();
        var img_width = $('#resizeMolA').width();
        $('#resizeMolA #moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });

    $(function () {
        $("#resizeMolB").resizable();
    });
    $("#resizeMolB").resize(function () {
        var img_height = $('#resizeMolB').height();
        var img_width = $('#resizeMolB').width();
        $('#resizeMolB #moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });

    $(function () {
        $("#resizeMolC").resizable();
    });
    $("#resizeMolC").resize(function () {
        var img_height = $('#resizeMolC').height();
        var img_width = $('#resizeMolC').width();
        $('#resizeMolC #moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });

    if (notebook == "undefined" || notebook == undefined) {
    }
    else {
        updateExperiment(notebook, page);
    }

    $("#txtExperiment").prop('disabled', false) ;
}

function layoutView(notebook, page) {
    appendToolbar('view');
    appendMain('view');
    $(".viewTxt").prop("disabled", true);
    $(function () {
        $(".resizeMol").resizable();
    });
    $(".resizeMol").resize(function () {
        var img_height = $('#moleculeB').parent().parent().height();
        var img_width = $('#moleculeB').parent().parent().width();
        $('#moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });

    if (notebook == "undefined" || notebook == undefined) {
    }
    else {
        viewExperiment(notebook, page);
    }
}
 
function layoutEnum() {
    appendToolbar('enum');
    appendMain('enum'); 

    $(function () {
        $(".resizeMol").resizable();
    });
    $(".resizeMol").resize(function () {
        var img_height = $('#moleculeB').parent().parent().height();
        var img_width = $('#moleculeB').parent().parent().width();
        $('#moleculeB').css({ 'width': img_width, 'height': img_height - 20 });
    });
}

function layoutDecomp() {
    appendToolbar('decomp');
    appendMain('decomp');
}