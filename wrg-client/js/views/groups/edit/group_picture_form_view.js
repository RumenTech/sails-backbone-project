define([
    'marionette',
    'text!templates/groups/edit/group_picture_form.html',
    'lib/backbone.modelbinder',
    'models/groups/basic_info',
    'utils/imageUploader',
    'utils/imageValidator',
    'views/error_message_view',
    'utils/notifier',
    'utils/conversionUtils',
    'jcrop',
    'jqueryform'

], function (Marionette, Template, ModelBinder, BasicInformation, imageControl, imageValidator, ErrorMessageView, notificator, ConversionUtils) {
    'use strict';

    var ProfilePictureFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click #removephoto': 'deleteImage',
            'click #finalcrop': 'cropImage'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal, .save-button': 'closeModal'
        },

        bindings: {
            groupImage: '#profile-image'
        },

        initialize: function (params) {
            var config = this.model.reqres.request('config');
            this.modelBinder = new ModelBinder();
            this.model = new BasicInformation(null, params);
            this.model.set('id', params.model.id);
            this.model.set('groupImage', params.model.attributes.groupImage);
            this.model.set("imageManipulationEndPoint", config.restUrl + "/imgUpload/savePreparationImage");//Handlebar property
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            var tempValue = $("#mainimage");
            var frontImageUrl = tempValue[0].src;
            $("#profile-img").attr("src", frontImageUrl);

            var config = this.model.reqres.request('config');

            //bind the select photo so it automatically clicks upload button (old functionality preserved)
            $('#file-image').on('change', function () {
                $("#uploadFiles").click();
            });

            var that = this;
            var bar = $('.bar');
            var percent = $('.percent');
            var status = $('#status');

            $('form').ajaxForm({
                beforeSend: function () {
                    $("#loader").append("<img id='theImg' src='/img/ajax-loader.gif'/>");
                    var controlFlow = true;
                    if (!ConversionUtils.isBrowserIeLow()) {
                        //modern browser detected, use client size validation as first defense
                        var validationResult = imageValidator.validate($("#file-image")[0].files, config.imageSize); //var validationResult = imageValidator.validate(this.files);

                        switch (validationResult) {
                            case 'Type':  //tested in Client
                                throw new that.userException(config.errorMessages.imageBadType);
                                break;
                            case 'Size': //tested in client
                                throw new that.userException(config.errorMessages.imageSizeBig);
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
                    var data = $.parseJSON(xhr.responseText); //IE 7 and 8 do not like JSON parsed in this way. pay big attention

                    if (data.hasOwnProperty("errormessage")) {
                        //if flag property exists, server rejected the upload as it is too big
                        notificator.validate(data.errormessage, "error");
                    } else {

                        $('#profileImgContainer').hide();
                        $('#removeContainer').hide();
                        $('#saveContainer').hide();
                        $('#cropContainer').show();
                        $("#loader").empty();

                        if (data.width > 600) {
                            var height = parseInt(600 / (data.width / data.height), 10);
                            $("#cropImage").css('height', height);
                            $("#cropImage").css('width', 600);
                            $("#cropImage").attr("src", config.endPoints.localStorage + data.imageName);
                        }
                        else {
                            $("#cropImage").css('height', data.height);
                            $("#cropImage").css('width', data.width);
                            $("#cropImage").attr("src", config.endPoints.localStorage + data.imageName);
                        }
                        //Must use setTimeout for this to work properly in Chrome
                        setTimeout(function () {
                            var jcrop = $.Jcrop('#cropImage', {
                                aspectRatio: 1,
                                bgOpacity: 0.5,
                                bgColor: 'black'
                            });

                            $('.jcrop-holder').css('margin', '0 auto');
                            jcrop.animateTo([ 180, 180, 0, 0 ]);

                            that.model.set('jcrop', jcrop);
                            that.model.set('imageName', data);
                        }, 0);
                    }
                }
            });
        },

        userException: function (message) {
            $("#loader").empty();
            notificator.validate(message, "error");
        },

        save: function () {
            this.model.set("groupImage", this.model.get("profile_image"));
            this.model.save(null, {
                success: _.bind(function () {
                    this.trigger('saved', this.model);
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                }, this)
            });
        },

        deleteImage: function () {
            imageControl.removeUserImage(this);
        },

        cropImage: function () {
            imageControl.cropImage(this);
        }
    });
    return ProfilePictureFormView;
});