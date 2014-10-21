/*
 * jQuery Image Gallery Demo JS 3.0.0
 * https://github.com/blueimp/jQuery-Image-Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true, regexp: true */
/*global $, document, window */

$(function () {
    'use strict';

    var reactions = getEnumeration();
    var rxns = $.parseJSON(reactions);
    var linksContainer = $('#links'),
            baseUrl;
    $.each(rxns, function (index, rxn) {
        baseUrl = 'data:image/x-png;base64,' + rxn.RXN;
        $('<a/>')
            .append($('<img>').prop('src', baseUrl))
            .prop('href', baseUrl )
            .prop('title', "")
            .attr('data-dialog', '')
            .appendTo(linksContainer);
    });

    // Load demo images from flickr:
    //$.ajax({
    //    url: (window.location.protocol === 'https:' ?
    //            'https://secure' : 'http://api') +
    //            '.flickr.com/services/rest/',
    //    data: {
    //        format: 'json',
    //        method: 'flickr.interestingness.getList',
    //        api_key: '7617adae70159d09ba78cfec73c13be3'
    //    },
    //    dataType: 'jsonp',
    //    jsonp: 'jsoncallback'
    //}).done(function (result) {
    //    var linksContainer = $('#links'),
    //        baseUrl;
    //    // Add the demo images as links with thumbnails to the page:
    //    $.each(result.photos.photo, function (index, photo) {
    //        baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
    //            photo.server + '/' + photo.id + '_' + photo.secret;
    //        $('<a/>')
    //            .append($('<img>').prop('src', baseUrl + '_s.jpg'))
    //            .prop('href', baseUrl + '_b.jpg')
    //            .prop('title', photo.title)
    //            .attr('data-dialog', '')
    //            .appendTo(linksContainer);
    //    });
    //});

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
        .button({icons: {primary: 'ui-icon-image'}})
        .on('click', function () {
            $('#blueimp-gallery-dialog .blueimp-gallery')
                .data('startSlideshow', true);
            $('#links').children().first().click();
        });

});

function getEnumeration() {
    var server = window.location.protocol + "//" + window.location.host;

    var ret = $.ajax({
        type: "POST",
        url: server + "/Reaction.asmx/TestEnumeration",
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

