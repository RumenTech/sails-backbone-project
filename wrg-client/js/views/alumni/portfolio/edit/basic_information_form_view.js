define([
    'marionette',
    'text!templates/alumni/portfolio/edit/basic_information_form.html',
    'lib/backbone.modelbinder',
    'models/professional/basic_information',
    'utils/imageUploader',
    'utils/imageValidator',
    'views/error_message_view',
    'utils/notifier',
    'utils/searchAsYouType',
    'utils/conversionUtils',
    'lib/jqueryui'
], function (Marionette, Template, ModelBinder, Alumnus, imageControl, imageValidator, ErrorMessageView, notificator, SearchAsYouType, ConversionUtils) {
    "use strict";

    var StoryFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click #add-media-image': function () {
                $('#file-image').off('change');
                $('#file-image').click();
                this.imageControlBinder();
            },
            'keyup #searchSchools': function () {
                SearchAsYouType.searchSchools(this, 'searchSchools');
            },
            'click .save': 'save',

            'click #removephoto': function () {
                imageControl.removeUserImage(this);
            },

            'change #videoUrl': function (e) {
                var videoFieldValue = $("#videoUrl").val();
                $("#videoUrl").select();
                var videoCode = this.youTubeLinkValidator(videoFieldValue, false);
                if (videoCode) {
                    this.model.set("profile_video", this.youTubeLinkValidator(videoFieldValue, true));
                    $("#videoUrl").css('background-color', 'green');
                    $("#happyPlayer").show();
                    $("#happyPlayer").attr("src", "http://www.youtube.com/embed/" + this.youTubeLinkValidator(videoFieldValue, true));
                } else {
                    $("#videoUrl").css('background-color', 'red');
                    $("#videoUrl").val("");
                    $("#happyPlayer").hide();
                }
            }
        },

        triggers: {
            'click .close-reveal-modal, .button.save': 'closeModal'
        },

        bindings: {
            'first_name': '[name=first-name]',
            'last_name': '[name=last-name]',
            'major': '[name=major]',
            'job_title': '[name=job-title]',
            'company': '[name=company]',
            'personal_url': '[name=personal-url]',

            'alma_mater': '[name=searchSchools]',
            'graduation_year': '[name=graduation_year]',
            'highest_edu_level': '[name=education]',
            'industry': '[name=industries]',

            'activities': '[name=activities]',
            'advice': '[name=advice]',
            'hindsight': '[name=hindsight]'
        },

        initialize: function (options) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Alumnus(options);
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);

            if (this.model.get('profile_video') == null) {
                this.$el.find('#happyPlayer').hide();
            }
        },

        imageUpload: function () {
            //pass the model property name as second parameter
            imageControl.imageUploader(this, "profile_image");
            $("#loaderIcon").append("<img id='theImg' style='height: 16px; width: 16px' src='./img/ajax-loader-small.gif'/>");
        },

        youTubeLinkValidator: function (url, returnType) {  //TODO IMplement the youtubechecker in other places in tghe code
            var link = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

            if (returnType) {
                return (url.match(link)) ? RegExp.$1 : false;  //returns valid youtube code
            } else {
                return (url.match(link)) ? true : false; //returns true
            }
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
            this.model.set('alma_mater', $('#searchSchools').val());
            var schoolId = $('#searchSchoolsId').val();
            if (schoolId === '' || schoolId === undefined) {
                schoolId = null;
            } else {
                schoolId = ConversionUtils.returnInteger(schoolId);
            }
            this.model.set('school_list_id', schoolId);

            this.model.save(null, {
                type: 'PUT',
                success: _.bind(function () {
                    this.model.trigger('saved');
                }, this),
                error: _.bind(function (response) {
                }, this)
            });
        }
    });
    return StoryFormView;
});