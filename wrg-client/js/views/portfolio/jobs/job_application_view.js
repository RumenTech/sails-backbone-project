define([
    'marionette',
    'text!templates/portfolio/jobs/job_application_form.html',
    'lib/backbone.modelbinder',
    'models/company/job_application',
    'views/error_message_view',
    'utils/conversionUtils',
    'utils/notifier',
    'utils/imageValidator',
    'lib/jqueryui',
    'jqueryform'
], function (Marionette, Template, ModelBinder, JobApplicationModel, ErrorMessageView, ConversionUtils, notificator, fileValidator) {
    'use strict';

    var JobApplicationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (params) {
            var config = params.reqres.request('config');

            this.modelBinder = new ModelBinder();
            this.model = new JobApplicationModel(params.job_id, params);
            var jobId = ConversionUtils.returnInteger(params.job_id, 'Cannot convert job id'),
                applicantId = ConversionUtils.returnInteger(params.applicant_id, 'Cannot convert applicant id');
            this.model.set('job_id', jobId);
            this.model.set('applicant_id', applicantId);

            this.listenTo(this.model, 'invalid', this.showMessage, this);
            this.model.set("imageManipulationEndPoint", config.restUrl + "/fileupload/file");//Handlebar property
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            var config = this.model.reqres.request('config');
            var that = this;
            var bar = $('.bar');
            var percent = $('.percent');
            var status = $('#status');

            $('#file-image').on('change', function () {
                $("#uploadFiles").click();
            });

            $('form').ajaxForm({

                beforeSend: function () {
                    $("#loaderIcon").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");

                    //WIll activate only if HTML5 compliant browser is detected
                    if (!wrgSettings.browserVersion.msie) {
                        //modern browser detected, use client size validation as first defense
                        var validationResult = fileValidator.validateJobApplicationFile($("#file")[0].files, config.imageSize); //var validationResult = imageValidator.validate(this.files);

                        switch (validationResult) {
                            case 'Type':  //tested in Client. Superficial check only.
                                throw new this.userException(config.errorMessages.imageBadType);
                                break;
                            case 'Size': //tested in client
                                throw new this.userException(config.errorMessages.imageSizeBig);
                                break;
                            default:
                                break;
                        }
                    }
                    status.empty();
                    var percentVal = '0%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },

                uploadProgress: function (event, position, total, percentComplete) {
                    /* IE below 10 do not have access to filesystem. HTML5 has file object that gives us information
                     such as file location and file size. We have to support IE 8 and 9 which do not have that ability
                     the only way we can check for the file size is on the server side. If the browser supports HTML5, first check will
                     be on browser. Secondary check will be on server. In case of non HTML5 browsers, the only check is made on server
                     */
                    var percentVal = percentComplete + '%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },

                success: function () {
                    var percentVal = '100%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                    $("#loader").empty();
                },

                complete: function (xhr) {
                    var data = $.parseJSON(xhr.responseText);
                    //Server Defense(Type and Size): This is the only proper check in existence.
                    if (data.hasOwnProperty("errormessage")) {
                        //if flag property exists, server rejected the upload as it is too big or the type is wrong
                        notificator.validate(data.errormessage, "error");
                        $("#loaderIcon").empty();
                        return;
                    }
                    notificator.validate("Great. Your file is uploaded!!!", "success");
                    that.model.set('cover_letter', data.url);
                    $('#attachedFile').val(data.url);
                    $('#loaderIcon').empty();
                }
            });
        },

        userException: function (message) {
            notificator.validate(message, "error");
            $("#loaderIcon").empty();
        },

        save: function () {
            this.message.close();
            this.model.save(null, {
                success: _.bind(function (data) {
                    if (data.attributes.message) {
                        notificator.validate(data.attributes.message, 'success');
                    } else {
                        $('.close-reveal-modal').click();
                    }
                }, this),
                error: _.bind(function (model, response) {
                    this.showMessage(model, response);
                }, this)
            });
        },
        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return JobApplicationView;
});