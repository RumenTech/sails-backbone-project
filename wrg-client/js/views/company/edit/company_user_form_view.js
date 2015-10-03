define([
    'marionette',
    'text!templates/company/edit/company_user_form.html',
    'lib/backbone.modelbinder',
    'models/company/user',
    'views/error_message_view'
], function (Marionette, Template, ModelBinder, User, ErrorMessageView) {
    "use strict";

    var SkillsFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal',
            'click #cancel-button': 'closeModal',
            'click #save-button': 'save'
        },

        bindings: {
            'first_name': '#first-name',
            'last_name': '#last-name',
            'email': '#email',
            'password': '#password'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new User(params.data, params);
                this.isNew = true;
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        save: function () {
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.set({
                        'user_id': this.model.get('user').id,
                        'company_user_id': this.model.get('company_user').id
                    });
                    if (this.isNew) {
                        // Add the model to the awards collection.
                        this.collection.add(this.model);
                    }
                    this.model.trigger('saved');
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
    return SkillsFormView;
});