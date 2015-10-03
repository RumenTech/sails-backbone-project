/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/10/13
 * Time: 9:50 AM
 * To change this template use File | Settings | File Templates.
 * Shared image uploading file that can be reused within whole application
 * imageUploader accepts this as a calling parameter
 */
define([
        'jquery',
        'underscore',
        './notifier'
    ],
    function ($, _, notificator) {
        'use strict';

        var fileUploader = {

            sendPdfInEmail: function (pdfDestinationEmail) {

                if(!pdfDestinationEmail) {
                    notificator.validate("Please enter email address :)", "error");
                    return;
                }
                     //Regex Madness :D
                if(!pdfDestinationEmail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                    notificator.validate("Please enter a valid email address. Example: john@example.com :)", "error");
                    return;
                }
                $("#emailpdf").prop("disabled", false);
                //Rather primitive way of checking. Perform regex http checking
                if (!wrgSettings.pdfMaterial.completeUrl || wrgSettings.pdfMaterial.completeUrl.length < 10) {

                    notificator.validate("Oh no. Somehow your CV is lost. Can you please generate it again?", "error");
                    return;
                }

                var packedPdfInformation = {
                    emailPdfAddress: pdfDestinationEmail
                };

                packedPdfInformation.locationOfPdf = wrgSettings.pdfMaterial.completeUrl;

                $.ajax({
                    url: wrgSettings.currentConfig.restUrl + '/PdfMaker/sendPdfEmail',
                    data: packedPdfInformation,
                    type: 'POST',
                    cache: false,
                    success: function (response) {
                        notificator.validate("Great. Email Sent :)", "success");
                    },
                    //This error comes from server
                    error: function (request, status, error) {
                        notificator.validate("Oh no. You have reached the email sending limit", "error");
                    }
                });
            },

            filePdfUploader: function (config) {
                $("#loaderIcon").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");
                var postData = JSON.stringify(localStorage.getItem('clientImage'));

                wrgSettings.pdfMaterial.imageData = postData;

                $.ajax({
                    url: config.restUrl + '/PdfMaker/getMyPdf',
                    data: wrgSettings.pdfMaterial,
                    type: 'POST',
                    cache: false,
                    success: function (pdfUrl) {
                        notificator.validate("Great. PDF Generated!!!", "success");
                        wrgSettings.pdfMaterial.completeUrl = pdfUrl;
                        $("#viewcv").show().addClass("myViewCVButton animated zoomIn");
                        $("#viewcv").prop("disabled", false);
                        $("#createcvbutton").prop("disabled", false);
                        $('#loaderIcon').empty();
                    },
                    //This error comes from server
                    error: function (request, status, error) {
                        $('#loaderIcon').empty();
                        notificator.validate(request.responseText, "error");
                    }
                });
            },
            fileUploader: function (that) {
                var self = that;
                $("#loaderIcon").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");

                var config = that.model.reqres.request('config');
                var file = new FormData(document.forms.namedItem("fileinfo"));

                $.ajax({
                    url: config.restUrl + '/fileupload/file',
                    data: file,
                    type: 'POST',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        notificator.validate("Great. Your file is uploaded!!!", "success");
                        self.model.set('cover_letter', data);
                        $('#attachedFile').val(data);
                        $('#loaderIcon').empty();
                    },
                    //This error comes from server
                    error: function (request, status, error) {
                        $('#loaderIcon').empty();
                        notificator.validate(request.responseText, "error");
                    }
                });
            }
        };
        return fileUploader;
    });