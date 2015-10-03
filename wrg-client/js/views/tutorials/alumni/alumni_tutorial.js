define([
    'marionette',
    'text!templates/tutorial/student_tutorial_form.html',
    'lib/backbone.modelbinder',
    'utils/imageUploader',
    'utils/imageValidator',
    'views/error_message_view',
    'utils/notifier'

], function (Marionette, Template, ModelBinder, imageControl, imageValidator, ErrorMessageView, notificator) {
    'use strict';

    var ProfilePictureFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click #file-image': function () {

                $('#file-image').off('change');
                this.imageControlBinder();
            },
            'click .save-button': 'save',
            'click #gotoFriendsUrl': function () {
                this.model.set("findFriend", "somesearchvalue");
                window.location.href = "http://localhost:7000/#friends";
            },

            'click #removephoto': function () {
                imageControl.removeUserImage(this);
            },
            'click #nexttutorial': function (e) {

                var slideOne = $("#firstSlide");
                var slideTwo = $("#secondSlide");
                var slideThree = $("#thirdSlide");
                var slideFour = $("#fourthSlide");

                if (slideOne.hasClass('showCurrentSlide')) {

                    slideOne.hide().show().fadeOut(1100);
                    slideOne.addClass('hideCurrentSlide');
                    slideOne.removeClass('showCurrentSlide');
                    slideTwo.addClass('showCurrentSlide').fadeIn(1500);
                    return;
                }

                if (slideTwo.hasClass('showCurrentSlide')) {
                    slideTwo.hide().show().fadeOut(1100);
                    slideTwo.addClass('hideCurrentSlide');
                    slideTwo.removeClass('showCurrentSlide');
                    slideThree.addClass('showCurrentSlide');
                    return;
                }

                if (slideThree.hasClass('showCurrentSlide')) {
                    slideThree.hide().show().fadeOut(1100);
                    slideThree.addClass('hideCurrentSlide');
                    slideThree.removeClass('showCurrentSlide');
                    slideFour.addClass('showCurrentSlide');
                    return;
                }
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal, .save-button': 'closeModal'
        },

        initialize: function () {
            this.modelBinder = new ModelBinder();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        imageUpload: function () {
            //pass the model property name as second parameter
            imageControl.imageUploader(this, "profile_image");
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        imageControlBinder: function () {
            var that = this;

            var newImageSelected = function () {
                var validationResult = imageValidator.validate(this.files);
                switch (validationResult) {
                    case 'Type':  //tested in Client
                        notificator.validate("Image type is not correct", "error");
                        break;
                    case 'Size': //tested in client
                        notificator.validate("Size is to big", "error");
                        break;
                    default:    //any other error will come from server
                        //TODO move this to server, server has final word
                        that.imageUpload();
                        break;
                }
            };
            $('#file-image').on('change', newImageSelected);
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
        }
    });
    return ProfilePictureFormView;
});