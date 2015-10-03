define([
    'marionette',
    'text!templates/admin/mass_email_form.html',
    'lib/backbone.modelbinder',
    'models/admin/email',
    'views/error_message_view'
], function (Marionette, Template, ModelBinder, MassEmail, ErrorMessageView) {
    "use strict";

    var MassEmailFormView = Marionette.Layout.extend({
        template: Template,

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        regions: {
            message: '.validation-messages'
        },

        bindings: {
            content: '#content',
            type: '#type'
        },

        events: {
            'click .save-button': 'save',
            'click .cancel-button': 'cancel'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            this.model = new MassEmail(null, params);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        cancel: function () {
            $('.close-reveal-modal').click();
        },

        save: function () {
            this.model.save(null, {
                success: _.bind(function () {
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });

    return MassEmailFormView;
});