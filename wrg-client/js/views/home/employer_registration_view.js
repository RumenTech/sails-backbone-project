define([
    'marionette',
    'text!templates/home/employer_registration.html',
    'models/registration_model',
    'views/error_message_view',
    'utils/notifier',
    'utils/eventValidation'
], function (Marionette, Template, RegistrationModel, ErrorMessageView, Notificator, validationRules) {
    "use strict";

    var EmployerRegistrationView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #save-user': 'save',
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'blur .validator': function (e) {
                validationRules.validatorEngine(e);
            },
            'submit #fileinfo': function (e) {
                this.save(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        initialize: function (options) {
            this.model = new RegistrationModel(null, options);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        save: function (e) {
            e.preventDefault();
            this.message.close();
            this.model.set({
                'role': 'company',
                'first_name': this.$('#first-name').val(),
                'last_name': this.$('#last-name').val(),
                'company_name': this.$('#company').val(),
                'email': this.$('#email').val(),
                'password': this.$('#password').val(),
                'repeatPassword': this.$('#repeatPassword').val(),
                'payment_flag': false
            });

            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('registration:success');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        showMessage: function (model, message) {
            $(".validation-messages").css("display", "block");
            setTimeout(function () {
                $('.validation-messages').fadeOut(2000);
            }, 3000);
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return EmployerRegistrationView;
});