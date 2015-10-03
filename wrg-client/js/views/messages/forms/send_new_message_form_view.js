define([
    'marionette',
    'text!templates/messages/forms/send_new_message_form.html',
    'lib/backbone.modelbinder',
    'views/error_message_view'
], function (Marionette, Template, ModelBinder, ErrorMessageView) {

    var NewMessageFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .send-button': 'send',
            'click .cancel-button': 'cancel'
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
            this.reply = params.reply;
            this.model = params.model;
            this.render();
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
        },

        deleteMessage: function () {
        },

        send: function () {
            this.model.trigger('send');
            $('.close-reveal-modal').click();
        },

        cancel: function () {
            $('.close-reveal-modal').click();
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return NewMessageFormView;
});