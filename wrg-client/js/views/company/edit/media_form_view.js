define([
    'marionette',
    'text!templates/company/edit/media_form.html',
    'lib/backbone.modelbinder',
    'models/company/media_model',
    'views/company/media_compositeview',
    'views/error_message_view',
    'utils/imageUploader',
    'utils/imageValidator',
    'utils/notifier',
    'utils/conversionUtils',
    'utils/eventValidation',
    'jqueryform'
], function (Marionette, Template, ModelBinder, MediaModel, CandidatesCollectionView, ErrorMessageView, ImageControl, ImageValidator, Notificator, conversionUtils, ValidationRules) {
    "use strict";

    var MediaFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .add-photo-button': 'addPhoto',
            'click .icon-delete': 'removeMedia',
            'click .icon-edit': 'editMedia',
            'click #cancelPhotoEdit': 'cancelPhoto',
            'click #savePhotoEdit': 'updatePhoto',
            'click #cancelVideoEdit': 'cancelVideo',
            'click #saveVideoEdit': 'updateVideo',
            'click .save-button': function () {
                $('.close-reveal-modal').click();
            },
            'click .add-video-button': function () {
                var isValidVideo = this.youTubeLinkValidator($("#videoUrl").val(), false);

                if (isValidVideo) {
                    $("#videoUrl").css('background-color', 'green');
                    this.addVideo();
                } else {
                    $("#videoUrl").css('background-color', 'red');
                }
            },
            'change .validator': function (e) {
                ValidationRules.validatorEngine(e);
            },
            'blur #videoUrl': function () {
                var isValidVideo = this.youTubeLinkValidator($("#videoUrl").val(), false);

                if (isValidVideo) {
                    $("#videoUrl").css('background-color', 'green');
                } else {
                    $("#videoUrl").css('background-color', 'red');
                }
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'media_url': '#photoUrl',
            'photo_caption': '#photoCaption',
            'video_url': '#videoUrl',
            'video_caption': '#videoCaption'
        },

        addVideo: function () {
            if ($('#videoUrl').val() === '') {
                this.showMessage(this.model, 'You need to add video url first');
            } else {

                var company_id = this.model.get('company_id');
                var index = this.model.collection.models.length,
                    video_url = $('#videoUrl').val(),
                    videoCaption = $('#videoCaption').val();

                this.mediaHtml(index, '', "http://www.youtube.com/watch?v=" + video_url.split("v=")[1], 'video');
                this.model.set({
                    'media_url': "http://www.youtube.com/watch?v=" + video_url.split("v=")[1],
                    'type': 'video',
                    'video_caption': videoCaption
                });

                this.model.collection.add(this.model);
                this.afterRender();
                this.save();
            }
        },

        addPhoto: function () {
            if ($('#photoUrl').val() === '') {
                this.showMessage(this.model, 'You need to add photo url first');
            } else {
                var index = this.model.collection.models.length,
                    photo_url = $('#photoUrl').val(),
                    photoCaption = $('#photoCaption').val();

                this.mediaHtml(index, '', photo_url, 'photo');
                this.model.set({
                    'media_url': photo_url,
                    'type': 'photo',
                    'photo_caption': photoCaption
                });
                this.model.collection.add(this.model);
                this.afterRender();
                this.save();
            }
        },

        removeMedia: function (e) {
            var modelSize = this.model.collection.models.length;
            if (modelSize === 0) {
                $('.close-reveal-modal').click();
            }

            var id = conversionUtils.returnInteger(e.currentTarget.id);
            this.model.collection.at(id).set('deleted', 'on');
            var media_id = this.model.collection.at(id).get('id');

            if (media_id) {
                this.model.fetch({ data: $.param({ id: media_id }),
                    type: 'delete',
                    success: _.bind(function () {

                        this.model.trigger('deleted');

                        if (modelSize === 1) {
                            //Clean after yourself
                            $('#bigPicture').html("");
                            $('#mediaCounter').hide();
                            $('#mediaCaption').hide();
                            $("#leftMediaNavigator").hide();
                            $("#rightMediaNavigator").hide();
                        }
                        this.afterRender();
                        this.model.collection.remove(this.model.collection.at(id));
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                }, null);
            } else {
                this.afterRender();
            }
        },

        editMedia: function (e) {
            var id = conversionUtils.returnInteger(e.currentTarget.id);

            if (this.model.collection.at(id).get('type') === 'photo') {
                $('#photoCaption').val(this.model.collection.at(id).get('photo_caption'));
                $('#addPhoto').hide();
                $('#cancelPhotoEdit').show();
                var photoSaveBtn = $('#savePhotoEdit');
                photoSaveBtn.show();
                photoSaveBtn.attr('index', id);
            } else {
                $('#videoCaption').val(this.model.collection.at(id).get('video_caption'));
                $('#addVideo').hide();
                $('#cancelVideoEdit').show();
                var videSaveBtn = $('#saveVideoEdit');
                videSaveBtn.show();
                videSaveBtn.attr('index', id);
            }
        },

        cancelPhoto: function () {
            $('#photoCaption').val('');
            $('#addPhoto').show();
            $('#cancelPhotoEdit').hide();
            $('#savePhotoEdit').hide();
        },

        cancelVideo: function () {
            $('#videoCaption').val('');
            $('#addVideo').show();
            $('#cancelVideoEdit').hide();
            $('#saveVideoEdit').hide();
        },

        updatePhoto: function (e) {
            var id = conversionUtils.returnInteger(e.currentTarget.getAttribute('index'));
            var photoText = $('#photoCaption');
            this.model.collection.at(id).set('photo_caption', photoText.val());
            photoText.val('');
            $('#addPhoto').show();
            $('#cancelPhotoEdit').hide();
            $('#savePhotoEdit').hide();
            this.save();
        },

        updateVideo: function (e) {
            var id = conversionUtils.returnInteger(e.currentTarget.getAttribute('index'));
            var videoText = $('#videoCaption');
            this.model.collection.at(id).set('video_caption', videoText.val());
            videoText.val('');
            $('#addVideo').show();
            $('#cancelVideoEdit').hide();
            $('#saveVideoEdit').hide();
            this.save();
        },

        initialize: function (params) {
            var config = params.reqres.request('config');
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new MediaModel(params.data, params);
                this.model.set('company_id', params.company_id);
                this.isNew = true;
            }
            this.model.set("imageManipulationEndPoint", config.restUrl + "/imgUpload/image");//Handlebar property
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            this.afterRender();

            var companyId = this.model.get('company_id');

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
                    if (!conversionUtils.isBrowserIeLow()) {
                        //modern browser detected, use client size validation as first defense
                        var validationResult = ImageValidator.validate($("#file-image")[0].files, config.imageSize); //var validationResult = imageValidator.validate(this.files);

                        switch (validationResult) {
                            case 'Type':  //tested in Client
                                throw new that.userException(config.errorMessages.imageBadType);
                                break;
                            case 'Size': //tested in client
                                throw new that.userException(config.errorMessages.imageSizeBig);
                                break;
                            default:    //any other error will come from server
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
                    var data = $.parseJSON(xhr.responseText);

                    if (data.hasOwnProperty("errormessage")) {
                        //if flag property exists, server rejectged the upload as it is too big
                        $("#loaderIcon").empty();
                        Notificator.validate(data.errormessage, "error");
                        return;
                    }
                    if (conversionUtils.isBrowserIeLow()) { //Parse correct S3 image path
                        var tempData = data.url.split("amp;");
                        var endResult = tempData.join("");

                        data.url = endResult;
                    }

                    $("#loaderIcon").empty();
                    $("#profile-img").attr("src", data.url);//required for display of preview image on media pages
                    var numberOfPhotos = 0;
                    that.model.collection.models.forEach(function (media) {
                        if (media.get('type') === 'photo') {
                            numberOfPhotos++;
                        }
                    });
                    if (numberOfPhotos > config.media.maxNumberOfPhotoFiles - 1) {
                        Notificator.validate('You cannot upload more than ' + config.media.maxNumberOfPhotoFiles + ' images!', "error");
                    } else {
                        $('#photoUrl').val(data.url);
                        Notificator.validate("Great. Your image has been uploaded!", "success");
                        that.model = new MediaModel(that, that.model);
                        that.model.set('company_id', companyId);
                    }
                }
            });
        },

        afterRender: function () {
            var that = this;
            //set all text values to empty after media is added
            $('#photoUrl').val('');
            $('#photoCaption').val('');
            $('#videoUrl').val('');
            $('#videoCaption').val('');
            $('#loadedImages').html('');
            $('#deleteImages').html('');
            var index = 0;
            if (this.model.hasOwnProperty("collection")) {
                this.model.collection.models.forEach(function (media) {
                    if (media.get('deleted') !== 'on') {
                        var isVideo = media.get('type'),
                            video_url = media.attributes.embedded,
                            photo_url = media.attributes.media_url
                        that.mediaHtml(index, video_url, photo_url, isVideo);

                        media.set('index', index);
                        $('#photoUrl' + media.get('index')).val(media.attributes.media_url);
                        index++;
                    }
                });
            }
        },

        mediaHtml: function (index, video_url, photo_url, type) {
            $('#mediaCounter').show();
            $('#mediaCaption').show();
            $('#groupMediaCaption').show();
            $("#leftMediaNavigator").show();
            $("#rightMediaNavigator").show();

            var company_id = this.model.get('company_id');

            if (type === 'video') {
                var myLoadedImages = $('<img/>');
                myLoadedImages.attr('width', 100);
                myLoadedImages.attr('height', 100);
                myLoadedImages.attr('src', video_url);

                this.model = new MediaModel(this, this.model);
                this.model.set('company_id', company_id);

            } else {
                var photoId = 'photoUrl' + index;

                var myLoadedImages = $('<img/>');
                myLoadedImages.attr('width', 100);
                myLoadedImages.attr('height', 100);
                myLoadedImages.attr('src', photo_url);
            }

            var deleteImage = $('<i/>');
            deleteImage.attr('id', index);
            deleteImage.attr('class', 'icon-delete tip-top');
            deleteImage.attr('title', 'delete');
            deleteImage.attr('style', 'cursor: pointer;');
            deleteImage.attr('type', 'text');

            var editImage = $('<i/>');
            editImage.attr('id', index);
            editImage.attr('class', 'icon-edit tip-top');
            editImage.attr('title', 'edit');
            editImage.attr('style', 'cursor: pointer;');
            editImage.attr('type', 'text');

            $('#loadedImages').append(myLoadedImages);
            $('#loadedImages').append(editImage);
            $('#loadedImages').append(deleteImage);
        },

        userException: function (message) {
            $("#loaderIcon").empty();
            Notificator.validate(message, "error");
        },

        save: function () {
            var modelSize = this.model.collection.models.length;
            if (modelSize === 0) {
                $('.close-reveal-modal').click();
            }

            this.model.collection.models.forEach(function (media) {
                if (media.get('deleted') !== 'on') {
                    media.set('saved', 'on');
                    media.save(null, {
                        success: _.bind(function () {
                            //$('.close-reveal-modal').click();
                        }, this),
                        error: _.bind(function (model, response) {
                            var message = response.responseJSON.message;
                        }, this)
                    });
                }
            });
            if (this.collection.length === 0) {
                $('.close-reveal-modal').click();
                $('#groupGallery').css('display', 'none');
                $('#imageNavigationButtons').css('display', 'none');
            }
        },

        youTubeLinkValidator: function (url, returnType) {  //TODO IMplement the youtubechecker in other places in tghe code
            var link = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

            if (returnType) {
                return (url.match(link)) ? RegExp.$1 : false;  //returns valid youtube code
            } else {
                return (url.match(link)) ? true : false; //returns true
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        imageUpload: function () {
            ImageControl.imageUploader(this, 'media_url', 'media');
        }
    });
    return MediaFormView;
});

