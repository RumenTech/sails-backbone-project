define([
    'marionette',
    'text!templates/home/pwdreset.html',
    'models/pwd',
    'views/error_message_view'
], function (Marionette, Template, PwdResetView, ErrorMessageView) {
    "use strict";

    var PasswordRegistrationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'keypress #login-email': 'keyManager',
            'click .request-pass': 'requestPass'
        },
        regions: {
            message: '.validation-messages'
        },

        initialize: function (params) {
            this.model = new PwdResetView(null, params);
            this.vent = params.vent;
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onSubmit: function () {
            return false;
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.requestPass();
            }
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        requestPass: function () {
            this.message.close();

            this.model.set({
                'username': this.$('#login-email').val()
            });

            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('pwdreset:success');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        }
    });
    return PasswordRegistrationView;
});