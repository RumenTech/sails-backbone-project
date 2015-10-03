define([
    'marionette',
    'text!templates/company/challenges/add_challenge_form.html',
    'lib/backbone.modelbinder',
    'models/company/challenge',
    'views/error_message_view',
    'lib/jqueryui',
    'wysiwyg'
], function (Marionette, Template, ModelBinder, Challenge, ErrorMessageView) {
    "use strict";

    var AddChallengeView = Marionette.Layout.extend({
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

        bindings: {
            'challenge_title': '#challenge-title',
            'location': '#location',
            'apply_link': '#apply-link',
            'contact_name': '#contact-name',
            'department': '#department',
            'challenge_description': '#challenge-description',
            'expected_deliverable': '#expected-deliverable',
            'skill_keywords': '#keywords',
            'difficulty_level': '[name=difficulty-level]'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Challenge(params.data, params);
                this.model.set('company_id', params.company_id);
                this.model.set('company_image', params.company_image);
                this.isNew = true;
                this.reqres = params.reqres;
                this.config = this.reqres.request('config');
            }

            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            setTimeout(function () {
                $('#challenge-description').wysiwyg({
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

                $('#expected-deliverable').wysiwyg({
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

        save: function () {
            $('.save-button').attr("disabled", true);
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {
                    if (this.isNew) {
                        var currentDate = new Date();
                        this.model.set("postedOn", currentDate.toDateString());
                        this.collection.add(this.model);
                    }
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {

                    $('.save-button').attr("disabled", false);
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });

    return AddChallengeView;
});

