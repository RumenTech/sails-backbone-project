define([
    'marionette',
    'text!templates/tutorial/student_tutorial_form.html',
    'lib/backbone.modelbinder',
    'utils/imageUploader',
    'utils/imageValidator',
    'views/error_message_view',
    'utils/notifier',
    'utils/conversionUtils',
    'jcrop',
    'jqueryform'

], function (Marionette, Template, ModelBinder, imageControl, imageValidator, ErrorMessageView, notificator, ConversionUtils) {
    'use strict';

    var ProfilePictureFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click #finalcropsave': 'save',
            'keypress .tutorialEnterKey': 'keyEnterManager',
            'click #finalcrop': 'cropImage',
            'click #add-media-image': function () {
                //$('#file-image').off('change');
                $('#file-image').click();
                //this.imageControlBinder();
            },
            'click #gotoFriendsUrl': function (e) {
                this.fieldValidator("tutorial-Friend-Search");
            },
            'click #gotoAlumniUrl': function () {
                this.fieldValidator("tutorial-Alumni-Search");
            },
            'click #gotoSearchGroupUrl': function () {
                this.fieldValidator("tutorial-Groups-Search");
            },
            'click #gotoCreateGroupUrl': function () {
                this.navigateApplication("Newgroup");
            },
            'click #nextTutorial': function () {
                this.navigateSlides();
                window.scrollTo(0, 0);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal, .save-button': 'closeModal'
        },

        initialize: function (options) {

            var config = this.model.reqres.request('config');
            this.model.set("imageManipulationEndPoint", config.restUrl + "/imgUpload/savePreparationImage");//Handlebar property

            this.reqres = options.reqres;
            this.modelBinder = new ModelBinder();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        keyEnterManager: function (e) {
            if (e.which === 13) {
                this.fieldValidator(e.currentTarget.id);
            }
        },

        fieldValidator: function (id) {
            var where = id.split("-")[1];
            var currentElement = $("#" + id);
            var elementValue = currentElement.val();

            if (elementValue.length < 2) {
                currentElement.addClass('validationIsBad');
            } else {
                $(".reveal-modal-bg").click();
                this.navigateApplication(where);
            }
        },

        imageUpload: function () {
            //pass the model property name as second parameter
            imageControl.imageUploader(this, "profile_image", "tutorial");
        },

        onShow: function () {
            this.model.set("profile_image", Backbone.tutorialUrl);
            $("#profile-img").attr("src", Backbone.tutorialUrl);

            //First implementation
            var tutorialImageCheck = Backbone.tutorialUrl;

            var tempValue = $("#mainimage");
            var frontImageUrl = tempValue[0].src;

            if (typeof (tutorialImageCheck) !== "undefined") {
                this.model.set("profile_image", Backbone.tutorialUrl);
                $("#profile-img").attr("src", Backbone.tutorialUrl);
            } else {
                this.model.set("profile_image", frontImageUrl);
            }

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
                    if (!wrgSettings.browserVersion.msie) {
                        //modern browser detected, use client size validation as first defense
                        var validationResult = imageValidator.validate($("#file-image")[0].files, config.imageSize); //var validationResult = imageValidator.validate(this.files);

                        switch (validationResult) {
                            case 'Type':  //tested in Client
                                notificator.validate("Image type is not correct", "error");
                                return;
                                break;
                            case 'Size': //tested in client
                                notificator.validate("Size is too big", "error");
                                controlFlow = false;
                                break;
                            default:    //any other error will come from server
                                //TODO move this to server, server has final word
                                //imageControl.uploadOriginalImage(that);
                                break;
                        }
                    }

                    if (!controlFlow) {
                        //If the size limit is breached in browsers that support multipart/form then break execution right here!!!
                        return;
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
                        //if flag property exists, server rejectged the upload as it is too big
                        notificator.validate(data.errormessage, "error");
                        return;
                    }

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
            });
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        navigateSlides: function () {

            var slideOne = $("#firstSlide");
            var slideTwo = $("#secondSlide");
            var slideThree = $("#thirdSlide");
            var slideFour = $("#fourthSlide");
            var slideFive = $("#fifthSlide");

            if (slideOne.hasClass('showCurrentSlide')) {
                slideTwo.addClass('showCurrentSlide');
                var slideAnimator = slideOne.animate({
                    left: '250px',
                    opacity: '0.5',
                    height: '1px',
                    width: '1px'
                });
                slideAnimator.promise().done(function () {
                    slideOne.addClass('hideCurrentSlide');
                    slideOne.removeClass('showCurrentSlide');
                });
                return;
            }

            if (slideTwo.hasClass('showCurrentSlide')) {
                slideThree.addClass('showCurrentSlide');

                var slideAnimator = slideTwo.animate({
                    left: '250px',
                    opacity: '0.5',
                    height: '1px',
                    width: '1px'
                });

                slideAnimator.promise().done(function () {
                    slideTwo.addClass('hideCurrentSlide');
                    slideTwo.removeClass('showCurrentSlide');
                });
                return;
            }

            if (slideThree.hasClass('showCurrentSlide')) {
                slideFour.addClass('showCurrentSlide');

                var slideAnimator = slideThree.animate({
                    left: '250px',
                    opacity: '0.5',
                    height: '1px',
                    width: '1px'
                });
                slideAnimator.promise().done(function () {
                    slideThree.addClass('hideCurrentSlide');
                    slideThree.removeClass('showCurrentSlide');
                });
                return;
            }

            if (slideFour.hasClass('showCurrentSlide')) {
                slideFive.addClass('showCurrentSlide');
                $("#nextTutorial").hide();
                $("#finishTutorial").show();

                var slideAnimator = slideFour.animate({
                    left: '250px',
                    opacity: '0.5',
                    height: '1px',
                    width: '1px'
                });
                slideAnimator.promise().done(function () {
                    slideFour.addClass('hideCurrentSlide');
                    slideFour.removeClass('showCurrentSlide');
                });
                return;
            }
        },

        navigateApplication: function (where) {
            var config = this.reqres.request('config');

            if (where === "Friend") {
                var searchFriendValue = $("#tutorial-Friend-Search").val();
                window.location.href = config.clientLocation + "/#friends/" + searchFriendValue;
            }

            if (where === "Alumni") {
                var searchAlumniValue = $("#tutorial-Alumni-Search").val();
                window.location.href = config.clientLocation + "/#success_stories/" + searchAlumniValue;
            }

            if (where === "Groups") {
                var searchGroupValue = $("#tutorial-Groups-Search").val();
                window.location.href = config.clientLocation + "/#find_groups/" + searchGroupValue;
            }

            if (where === "Newgroup") {
                window.location.href = config.clientLocation + "/#find_groups/" + "wrggroups";
            }
        },

        save: function () {
            this.model.save(null, {

                success: _.bind(function () {
                    $('#mainimage').attr('src', this.model.attributes.profile_image);
                    this.trigger('saved', this.model);
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                }, this)
            });
        },

        openFile: function () {
            $('#file-image').off('change');
            this.imageControlBinder();
        },

        deleteImage: function () {
            imageControl.removeUserImage(this);
        },

        cropImage: function () {
            imageControl.cropImage(this, "saveme");
        }
    });
    return ProfilePictureFormView;
});