define([
    'marionette',
    'text!templates/messages/forms/delete_form.html',
    'models/groups/group',
    'lib/backbone.modelbinder',
    'views/error_message_view'
], function (Marionette, Template, Group, ModelBinder, ErrorMessageView) {
    'use strict';

    var DeleteMessageFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #deleteMessage': function (e) {
                this.deleteMessage(e);
            },
            'click #cancel': 'cancel'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (params) {
            this.vent = params.vent;
            this.reqres = params.reqres;
            this.render();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
        },

        deleteMessage: function (e) {
            e.preventDefault();

            this.model.set('is_deleted', true);

            this.model.save(null, {
                success: _.bind(function () {
                    $('.close-reveal-modal').click();
                    this.model.collection.remove(this.model);
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        cancel: function () {
            $('.close-reveal-modal').click();
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return DeleteMessageFormView;
});