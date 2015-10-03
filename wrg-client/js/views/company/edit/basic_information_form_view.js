define([
    'marionette',
    'text!templates/company/edit/basic_information_form.html',
    'lib/backbone.modelbinder',
    'models/company/basic_information',
    'views/error_message_view',
    'utils/eventValidation'
], function (Marionette, Template, ModelBinder, BasicInformation, ErrorMessageView, validationRules) {
    "use strict";

    var BasicInformationFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            company_size: '#company-size',
            state: '#state',
            city: '#city',
            company_website: '#company-website',
            tagline: '#tagline',
            description: '#description',
            facebook_url: '#facebook-url',
            twitter_url: '#twitter-url',
            google_url: '#google-url',
            linkedin_url: '#linkedin-url'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            this.model = new BasicInformation(params.model.attributes, params);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
            this.model.on('saved', this.render, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();
                    this.trigger('saved', this.model);

                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return BasicInformationFormView;
});