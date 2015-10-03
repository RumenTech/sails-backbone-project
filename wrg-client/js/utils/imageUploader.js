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

        var imageUploader = {

            uploadOriginalImage: function (that) {

                var config = that.model.reqres.request('config');
                $("#loader").append("<img id='theImg' src='/img/ajax-loader.gif'/>");
                var imageBinary = new FormData(document.forms.namedItem("fileinfo"));

                $.ajax({
                    url: config.endPoints.uploadPrepImage,
                    data: imageBinary,
                    type: 'POST',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
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

                    },
                    //This error comes from server
                    error: function (request, status, error) {
                        notificator.validate(request.responseText, "error");
                        $("#loader").empty();
                    }
                });
            },

            cropImage: function (that) {
                notificator.validate("One moment please, we are working on your image", "info");

                var args = arguments;

                var config = that.model.reqres.request('config');
                var self = this;
                var jcrop = that.model.get('jcrop');
                var imageInfo = jcrop.tellSelect();
                imageInfo.imageName = that.model.get('imageName').imageName;
                var width = that.model.get('imageName').width;
                var height = that.model.get('imageName').height;
                if (width > 600) {
                    var scaleIndex = width / 600;
                    imageInfo.x = parseInt(imageInfo.x * scaleIndex, 10);
                    imageInfo.y = parseInt(imageInfo.y * scaleIndex, 10);
                    imageInfo.w = parseInt(imageInfo.w * scaleIndex, 10);
                    imageInfo.h = parseInt(imageInfo.h * scaleIndex, 10);
                }

                $.ajax({
                    url: config.endPoints.cropImage,
                    data: imageInfo,
                    type: 'POST',
                    dataType: 'JSON',
                    success: function (data) {
                        // hide the crop button and restore previous condition as it was before
                        $("#cropImage").css('height', 0);
                        $("#cropImage").css('width', 0);
                        $('#cropContainer').hide();
                        $('#cropImage').removeAttr('src');
                        jcrop.destroy();
                        $('#profileImgContainer').show();
                        $('#removeContainer').show();
                        $('#saveContainer').show();
                        $("#profile-img").show();
                        $("#profile-img").attr("src", data.url);
                        that.model.unset('jcrop');
                        that.model.set('profile_image', data.url);

                        //Covers tutorial crop and automatic save feature
                        if (args.length > 1) {
                            args[0].model.set("profile_image", data.url);
                            Backbone.tutorialUrl = data.url;
                            self.saveCurrentModel(args[0]);
                        }

                        notificator.validate("Your image is proccessed", "success");
                    },
                    //This error comes from server
                    error: function (request, status, error) {
                        notificator.validate(request.responseText, "error");
                    }
                });
            },

            imageUploader: function (that, modelPropertyName, source) {
                var localThis = this;
                $("#loaderIcon").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");

                var config = that.model.reqres.request('config');
                var imageBinary = new FormData(document.forms.namedItem("fileinfo"));
                var imageRandomName = Math.floor((Math.random() * 100000000000) + 1);
                imageBinary.append("imagename", imageRandomName);

                if (source === 'media') {
                    $.ajax({
                        url: config.uploadImageUrl,
                        data: imageBinary,
                        type: 'POST',
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            $("#loaderIcon").empty();
                            $("#profile-img").attr("src", data);//required for display of preview image on media pages
                            var numberOfPhotos = 0;
                            that.model.collection.models.forEach(function (media) {
                                if (media.get('type') === 'photo') {
                                    numberOfPhotos++;
                                }
                            });
                            if (numberOfPhotos > config.media.maxNumberOfPhotoFiles - 1) {
                                notificator.validate('You cannot upload more than ' + config.media.maxNumberOfPhotoFiles + ' images!', "error");
                            } else {
                                $('#photoUrl').val(data);
                                notificator.validate("Great. Your image has been uploaded!", "success");
                            }
                        },
                        //This error comes from server
                        error: function (request, status, error) {
                            $("#loaderIcon").empty();
                            notificator.validate(request.responseText, "error");
                        }
                    });
                }
                else {
                    $.ajax({
                        url: config.uploadImageUrl,
                        data: imageBinary,
                        type: 'POST',
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (imageUrl) {
                            that.addNewMediaEntry('Image');
                            var img = "";
                            $('.media-image').last().attr('src', img.src = imageUrl);
                            $('#loaderIcon').empty();
                        },
                        //This error comes from server
                        error: function (request, status, error) {
                            notificator.validate(request.responseText, "error");
                        }
                    });
                }
            },

            removeUserImage: function (that, modelImageAttribute) {
                if (modelImageAttribute === null || modelImageAttribute === undefined || modelImageAttribute === '') {
                    modelImageAttribute = 'profile_image';
                }
                var config = that.model.reqres.request('config');
                that.model.set(modelImageAttribute, config.holdItPlaceHolders);
                $('#profile-img').attr('src', config.holdItPlaceHolders);
                $('#mainimage').attr('src', config.holdItPlaceHolders);
            },

            saveCurrentModel: function (that) {
                that.model.save(null, {
                    success: _.bind(function () {
                        $('#mainimage').attr('src', that.model.get("profile_image"));
                        that.trigger('saved', that.model);
                    }, that),
                    error: _.bind(function (model, response) {
                        var message = response.responseJSON.message;
                    }, that)
                });
            }
        };
        return imageUploader;
    }
);

