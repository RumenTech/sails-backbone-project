define([
    'marionette',
    'text!templates/portfolio/edit/personal_statement_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/personal_statement',
    'views/error_message_view',
    'wysiwyg'
], function (Marionette, Template, ModelBinder, PersonalStatement, ErrorMessageView) {
    'use strict';

    var PersonalStatementFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click #removeVideo': 'removeVideo',
            'click #video-url': function () {
                $("#video-url").select();
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'personal_statement': '#personal-statement',
            'video_url': '#video-url'
        },

        initialize: function () {
            this.modelBinder = new ModelBinder();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            setTimeout(function () {
                $('#personal-statement').wysiwyg({
                    autoGrow: true,
                    initialContent: "1000 characters maximum",
                    maxLength: 1000,
                    controls: {
                        strikeThrough: { visible: true },
                        underline: { visible: true },
                        subscript: { visible: true },
                        superscript: { visible: true }
                    }
                });
            }, 200);
        },

        youTubeLinkValidator: function (url, returnType) {  //TODO IMplement the youtubechecker in other places in tghe code
            var link = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

            if (returnType) {
                return (url.match(link)) ? RegExp.$1 : false;  //returns valid youtube code
            } else {
                return (url.match(link)) ? true : false; //returns true
            }
        },

        removeVideo: function () {
            this.model.set("video_url", "Please enter valid Youtube link");
            this.save("videoRemoved");
        },

        save: function (deleted) {
            this.message.close();
            var isVideoValid = this.youTubeLinkValidator($('#video-url').val());
            var currentVideoValue = $("#video-url").val();

            if (isVideoValid || currentVideoValue === "Please enter valid Youtube link") {
                this.model.save(null, {
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        $('.close-reveal-modal').click();
                        if (deleted === "videoRemoved") {
                            $("#videoiframe").width(0);
                            $("#videoiframe").height(0);
                            $('#videoiframe').attr('src', "");
                        }
                    }, this),
                    error: _.bind(function () {
                        // TODO: Replace with an error message
                        this.model.trigger('saved');
                    }, this)
                });
            } else {
                $("#video-url").css('background-color', 'red');
                $("#video-url").val("");
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return PersonalStatementFormView;
});